package com.servigo.servigo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.servigo.servigo.dto.ClienteReservaDTO;
import com.servigo.servigo.dto.ClienteReservasResponseDTO;
import com.servigo.servigo.dto.CrearReservaClienteDTO;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Reserva;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.DisponibilidadRepository;
import com.servigo.servigo.repository.EspecialidadRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ReservaRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;
import com.servigo.servigo.repository.UsuarioRepository;

@Service
@Transactional
public class ReservaService {

    private static final DateTimeFormatter FECHA_TEXTO = DateTimeFormatter.ofPattern(
            "d 'de' MMMM, yyyy",
            new Locale("es", "CL")
    );
    private static final DateTimeFormatter HORA_TEXTO = DateTimeFormatter.ofPattern("HH:mm");

    private final ReservaRepository reservaRepository;
    private final SolicitudServicioRepository solicitudRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicioRepository servicioRepository;
    private final PrestadorRepository prestadorRepository;
    private final EspecialidadRepository especialidadRepository;
    private final DisponibilidadRepository disponibilidadRepository;

    public ReservaService(
            ReservaRepository reservaRepository,
            SolicitudServicioRepository solicitudRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            ServicioRepository servicioRepository,
            PrestadorRepository prestadorRepository,
            EspecialidadRepository especialidadRepository,
            DisponibilidadRepository disponibilidadRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.solicitudRepository = solicitudRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicioRepository = servicioRepository;
        this.prestadorRepository = prestadorRepository;
        this.especialidadRepository = especialidadRepository;
        this.disponibilidadRepository = disponibilidadRepository;
    }

    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    public ClienteReservasResponseDTO listarReservasClienteAutenticado(String correo) {
        Cliente cliente = resolverClientePorCorreo(correo);
        List<Reserva> reservas = reservaRepository.findBySolicitud_Cliente_IdClienteOrderByFechaHoraReservaDesc(
                cliente.getIdCliente()
        );

        ClienteReservasResponseDTO response = new ClienteReservasResponseDTO();
        LocalDateTime ahora = LocalDateTime.now();

        for (Reserva reserva : reservas) {
            ClienteReservaDTO dto = mapearReservaCliente(reserva);
            if (esHistorial(reserva, ahora)) {
                response.getHistorial().add(dto);
            } else {
                response.getProximas().add(dto);
            }
        }

        return response;
    }

    /**
     * Flujo principal para que un cliente autenticado agende una cita con un prestador.
     */
    public Reserva crearReservaCliente(String correoCliente, CrearReservaClienteDTO dto) {
        if (dto.getIdPrestador() == null) {
            throw new RuntimeException("Debe enviar idPrestador");
        }
        if (dto.getFecha() == null || dto.getHora() == null) {
            throw new RuntimeException("Debe enviar fecha y hora de la reserva");
        }

        Cliente cliente = resolverClientePorCorreo(correoCliente);

        Servicio servicio = resolverServicioParaReserva(dto.getIdServicio(), dto.getIdPrestador());

        LocalDateTime fechaHora = parseFechaHora(dto.getFecha(), dto.getHora());
        validarReglasAgenda(fechaHora);

        boolean fechaExcluida = disponibilidadRepository
                .existsByPrestadorIdPrestadorAndFechaAndExcluido(
                        dto.getIdPrestador(), fechaHora.toLocalDate(), true);
        if (fechaExcluida) {
            throw new RuntimeException("Esta fecha no está disponible para agendar.");
        }

        Prestador prestador = servicio.getPrestador();
        if (prestador == null || !dto.getIdPrestador().equals(prestador.getIdPrestador())) {
            throw new RuntimeException("El servicio no pertenece al prestador indicado.");
        }

        SolicitudServicio solicitud = new SolicitudServicio();
        solicitud.setCliente(cliente);
        solicitud.setServicio(servicio);
        solicitud.setFechaHoraSolicitud(LocalDateTime.now());
        solicitud.setFechaHoraPreferida(fechaHora);
        solicitud.setEstado("pendiente");
        solicitud.setDireccionAtencion("Por confirmar");
        solicitud = solicitudRepository.save(solicitud);

        Reserva reserva = new Reserva();
        reserva.setSolicitud(solicitud);
        reserva.setFechaHoraReserva(fechaHora);
        reserva.setFechaCreacionReserva(LocalDateTime.now());
        reserva.setEstado("pendiente");

        return reservaRepository.save(reserva);
    }

    /**
     * Permite que un cliente autenticado elimine una reserva completada o cancelada.
     */
    public void eliminarReservaCliente(Long idReserva, String correo) {
        Cliente cliente = resolverClientePorCorreo(correo);
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getSolicitud() == null
                || reserva.getSolicitud().getCliente() == null
                || !cliente.getIdCliente().equals(reserva.getSolicitud().getCliente().getIdCliente())) {
            throw new RuntimeException("No tienes permiso para eliminar esta reserva");
        }

        String estado = reserva.getEstado() != null ? reserva.getEstado().toLowerCase(Locale.ROOT) : "";
        if (!puedeEliminarReserva(estado)) {
            throw new RuntimeException("Esta reserva no puede eliminarse. Solo se pueden eliminar reservas finalizadas o canceladas");
        }

        reservaRepository.deleteById(idReserva);
    }

    public void cancelarReservaCliente(Long idReserva, String correo) {
        Cliente cliente = resolverClientePorCorreo(correo);
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getSolicitud() == null
                || reserva.getSolicitud().getCliente() == null
                || !cliente.getIdCliente().equals(reserva.getSolicitud().getCliente().getIdCliente())) {
            throw new RuntimeException("No tienes permiso para cancelar esta reserva");
        }

        String estado = reserva.getEstado() != null ? reserva.getEstado().toLowerCase(Locale.ROOT) : "";
        if (estado.contains("cancel") || estado.contains("finaliz")) {
            throw new RuntimeException("Esta reserva ya no puede cancelarse");
        }

        reserva.setEstado("cancelada");
        reservaRepository.save(reserva);

        if (reserva.getSolicitud() != null) {
            SolicitudServicio solicitud = reserva.getSolicitud();
            solicitud.setEstado("cancelada");
            solicitudRepository.save(solicitud);
        }
    }

    public Reserva obtenerReservaPorId(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public Reserva crearReserva(Reserva reserva) {

        if (reserva.getSolicitud() == null || reserva.getSolicitud().getIdSolicitud() == null) {
            throw new RuntimeException("Debe enviar idSolicitud");
        }

        SolicitudServicio solicitud = solicitudRepository
                .findById(reserva.getSolicitud().getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        reserva.setSolicitud(solicitud);

        if (reserva.getFechaCreacionReserva() == null) {
            reserva.setFechaCreacionReserva(LocalDateTime.now());
        }

        return reservaRepository.save(reserva);
    }

    public Reserva actualizarReserva(Long id, Reserva reservaActualizada) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setFechaHoraReserva(reservaActualizada.getFechaHoraReserva());
        reserva.setEstado(reservaActualizada.getEstado());

        return reservaRepository.save(reserva);
    }

    public void eliminarReserva(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new RuntimeException("Reserva no encontrada");
        }
        reservaRepository.deleteById(id);
    }

    private Cliente resolverClientePorCorreo(String correo) {
        return usuarioRepository
                .findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(
                        UsuarioRepository.normalizarCorreo(correo))
                .flatMap(usuario -> clienteRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para este usuario"));
    }

    private Servicio resolverServicioParaReserva(Long idServicio, Long idPrestador) {
        if (idServicio != null) {
            Servicio servicio = servicioRepository.findById(idServicio)
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
            if (servicio.getPrestador() == null
                    || !idPrestador.equals(servicio.getPrestador().getIdPrestador())) {
                throw new RuntimeException("El servicio no pertenece al prestador indicado");
            }
            return servicio;
        }

        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        List<Servicio> servicios = servicioRepository.findByPrestadorIdPrestador(idPrestador);
        if (servicios != null && !servicios.isEmpty()) {
            return servicios.get(0);
        }

        throw new RuntimeException("El prestador no tiene servicios publicados. No es posible agendar.");
    }

    private LocalDateTime parseFechaHora(String fecha, String hora) {
        if (fecha == null || hora == null) {
            throw new RuntimeException("Debe enviar fecha y hora para la reserva.");
        }
        String horaNormalizada = hora.length() > 5 ? hora.substring(0, 5) : hora;
        DateTimeParseException last = null;

        // Intentar primero formato estándar HTML5 yyyy-MM-dd
        try {
            LocalDate d = LocalDate.parse(fecha);
            LocalTime t = LocalTime.parse(horaNormalizada);
            return LocalDateTime.of(d, t);
        } catch (DateTimeParseException e) {
            last = e;
        }

        // Intentar formato alternativo dd-MM-yyyy (por si el navegador lo envía así)
        try {
            DateTimeFormatter alt = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            LocalDate d = LocalDate.parse(fecha, alt);
            LocalTime t = LocalTime.parse(horaNormalizada);
            return LocalDateTime.of(d, t);
        } catch (DateTimeParseException ignored) {
            // fall through
        }

        throw new RuntimeException("Formato de fecha u hora inválido. Usa una fecha válida del selector.", last);
    }

    private boolean esHistorial(Reserva reserva, LocalDateTime ahora) {
        String estado = reserva.getEstado() != null ? reserva.getEstado().toLowerCase(Locale.ROOT) : "";
        if (estado.contains("cancel") || estado.contains("finaliz") || estado.contains("rechaz")) {
            return true;
        }

        LocalDateTime fecha = reserva.getFechaHoraReserva();
        if (fecha == null && reserva.getSolicitud() != null) {
            fecha = reserva.getSolicitud().getFechaHoraPreferida();
        }

        return fecha != null && fecha.isBefore(ahora);
    }

    private ClienteReservaDTO mapearReservaCliente(Reserva reserva) {
        ClienteReservaDTO dto = new ClienteReservaDTO();
        dto.setIdReserva(reserva.getIdReserva());

        SolicitudServicio solicitud = reserva.getSolicitud();
        LocalDateTime fechaHora = reserva.getFechaHoraReserva();

        if (solicitud != null) {
            Servicio servicio = solicitud.getServicio();
            if (servicio != null) {
                dto.setServicio(servicio.getNombre() != null ? servicio.getNombre() : "Servicio");
                if (servicio.getPrecioReferencial() != null && servicio.getPrecioReferencial() > 0) {
                    dto.setPrecioTexto(formatPrecio(servicio.getPrecioReferencial()));
                } else {
                    dto.setPrecioTexto("Consultar precio");
                }
                Prestador prestador = servicio.getPrestador();
                if (prestador != null) {
                    dto.setIdPrestador(prestador.getIdPrestador());
                    dto.setEspecialista(nombrePrestador(prestador));
                }
            }
            if (fechaHora == null) {
                fechaHora = solicitud.getFechaHoraPreferida();
            }
        }

        if (dto.getServicio() == null) {
            dto.setServicio("Servicio");
        }
        if (dto.getEspecialista() == null) {
            dto.setEspecialista("Especialista");
        }
        if (dto.getPrecioTexto() == null) {
            dto.setPrecioTexto("Consultar precio");
        }

        if (fechaHora != null) {
            dto.setFechaTexto(capitalizeMonth(fechaHora.format(FECHA_TEXTO)));
            dto.setHoraTexto(fechaHora.format(HORA_TEXTO) + " hrs");
        } else {
            dto.setFechaTexto("Por confirmar");
            dto.setHoraTexto("—");
        }

        // Fecha de solicitud (cuando se creó la reserva)
        if (reserva.getFechaCreacionReserva() != null) {
            dto.setFechaSolicitudTexto("Solicitado: " + capitalizeMonth(reserva.getFechaCreacionReserva().format(FECHA_TEXTO)));
        }

        String estadoRaw = reserva.getEstado() != null ? reserva.getEstado() : "pendiente";
        dto.setEstado(formatearEstado(estadoRaw));
        dto.setEstadoEtiqueta(etiquetaEstado(estadoRaw));
        dto.setMensajeDetalle(mensajeDetalleEstado(estadoRaw));

        // Determinar si puede eliminarse y si puede realizarse
        dto.setPuedeEliminar(puedeEliminarReserva(estadoRaw));
        dto.setPuedeRealizar(puedeRealizarReserva(estadoRaw));

        return dto;
    }

    private String nombrePrestador(Prestador prestador) {
        if (prestador.getEmpresa() != null) {
            String razon = prestador.getEmpresa().getRazonSocial();
            if (razon != null && !razon.isBlank()) {
                return razon;
            }
            String comercial = prestador.getEmpresa().getNombreComercial();
            if (comercial != null && !comercial.isBlank()) {
                return comercial;
            }
        }
        Usuario usuario = prestador.getUsuario();
        if (usuario == null) {
            return "Especialista";
        }
        String nombre = usuario.getNombre() != null ? usuario.getNombre() : "";
        String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
        String completo = (nombre + " " + apellido).trim();
        return completo.isEmpty() ? "Especialista" : completo;
    }

    private String formatPrecio(double precio) {
        return String.format(Locale.forLanguageTag("es-CL"), "$%,.0f", precio);
    }

    private String capitalizeMonth(String fecha) {
        if (fecha == null || fecha.isEmpty()) {
            return fecha;
        }
        int idx = fecha.indexOf(" de ");
        if (idx < 0) {
            return fecha;
        }
        String prefix = fecha.substring(0, idx + 4);
        String month = fecha.substring(idx + 4);
        if (!month.isEmpty()) {
            month = month.substring(0, 1).toUpperCase(Locale.ROOT) + month.substring(1);
        }
        return prefix + month;
    }

    private String formatearEstado(String estado) {
        String e = estado.toLowerCase(Locale.ROOT);
        if (e.contains("confirm")) {
            return "Confirmada";
        }
        if (e.contains("finaliz")) {
            return "Finalizada";
        }
        if (e.contains("cancel")) {
            return "Cancelada";
        }
        if (e.contains("rechaz")) {
            return "Rechazada";
        }
        if (e.contains("pendiente")) {
            return "Pendiente";
        }
        return estado.substring(0, 1).toUpperCase(Locale.ROOT) + estado.substring(1);
    }

    private String etiquetaEstado(String estado) {
        String e = estado.toLowerCase(Locale.ROOT);
        if (e.contains("confirm")) {
            return "success";
        }
        if (e.contains("pendiente")) {
            return "warning";
        }
        if (e.contains("cancel") || e.contains("rechaz")) {
            return "danger";
        }
        return "secondary";
    }

    private void validarReglasAgenda(LocalDateTime fechaHora) {
        LocalDate hoy = LocalDate.now();
        LocalDate min = hoy.plusDays(2);
        LocalDate siguienteMes = hoy.plusMonths(1);
        LocalDate max = siguienteMes.withDayOfMonth(siguienteMes.lengthOfMonth());

        LocalDate fecha = fechaHora.toLocalDate();
        if (fecha.isBefore(min) || fecha.isAfter(max)) {
            throw new RuntimeException(
                    "La fecha debe estar entre hoy + 2 días y el fin del mes siguiente."
            );
        }
        if (fechaHora.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("La fecha y hora seleccionadas ya han pasado.");
        }
    }

    private String mensajeDetalleEstado(String estado) {
        if (estado == null) {
            return "Esperando confirmación del especialista.";
        }
        String e = estado.toLowerCase(Locale.ROOT);
        if (e.contains("pendiente")) {
            return "Esperando confirmación del especialista.";
        }
        if (e.contains("confirm")) {
            return "El especialista confirmó tu cita.";
        }
        if (e.contains("finaliz")) {
            return "Atención completada. ¡Gracias por usar ServiGo!";
        }
        if (e.contains("cancel")) {
            return "Esta cita fue cancelada.";
        }
        if (e.contains("rechaz")) {
            return "El especialista no pudo aceptar esta solicitud.";
        }
        return null;
    }

    /**
     * Determina si una reserva puede ser eliminada por el cliente.
     * Solo se pueden eliminar reservas finalizadas o canceladas.
     */
    private boolean puedeEliminarReserva(String estado) {
        String e = estado.toLowerCase(Locale.ROOT);
        return e.contains("finaliz") || e.contains("cancel");
    }

    /**
     * Determina si una reserva puede ser realizada/agendada.
     * Solo las reservas pendientes o confirmadas pueden realizarse.
     */
    private boolean puedeRealizarReserva(String estado) {
        String e = estado.toLowerCase(Locale.ROOT);
        return e.contains("pendiente") || e.contains("confirm");
    }
}
