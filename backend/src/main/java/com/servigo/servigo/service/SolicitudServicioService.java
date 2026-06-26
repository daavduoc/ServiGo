package com.servigo.servigo.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.servigo.servigo.dto.AceptarSolicitudPrestadorDTO;
import com.servigo.servigo.dto.PrestadorTrabajoDTO;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ReservaRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;
import com.servigo.servigo.repository.UsuarioRepository;

@Service
public class SolicitudServicioService {

    private final SolicitudServicioRepository solicitudRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;
    private final PrestadorRepository prestadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;
    private final EmailService emailService;

    private static final DateTimeFormatter FECHA_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final String ESTADO_PENDIENTE = "pendiente";
    private static final String ESTADO_CONFIRMADA = "confirmada";
    private static final String ESTADO_RECHAZADA = "rechazada";

    public SolicitudServicioService(SolicitudServicioRepository solicitudRepository,
                                    ClienteRepository clienteRepository,
                                    ServicioRepository servicioRepository,
                                    PrestadorRepository prestadorRepository,
                                    UsuarioRepository usuarioRepository,
                                    ReservaRepository reservaRepository,
                                    EmailService emailService) {
        this.solicitudRepository = solicitudRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
        this.prestadorRepository = prestadorRepository;
        this.usuarioRepository = usuarioRepository;
        this.reservaRepository = reservaRepository;
        this.emailService = emailService;
    }

    public List<SolicitudServicio> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    public List<PrestadorTrabajoDTO> listarSolicitudesPendientesPrestador(String correo) {
        Prestador prestador = resolverPrestadorPorCorreo(correo);
        return solicitudRepository
                .findByServicio_Prestador_IdPrestadorAndEstadoOrderByFechaHoraPreferidaDesc(
                        prestador.getIdPrestador(), ESTADO_PENDIENTE)
                .stream()
                .map(this::mapearTrabajo)
                .collect(Collectors.toList());
    }

    public List<PrestadorTrabajoDTO> listarTrabajosPrestadorAutenticado(String correo) {
        Prestador prestador = resolverPrestadorPorCorreo(correo);
        return solicitudRepository
                .findByServicio_Prestador_IdPrestadorAndEstadoOrderByFechaHoraPreferidaDesc(
                        prestador.getIdPrestador(), ESTADO_CONFIRMADA)
                .stream()
                .map(this::mapearTrabajo)
                .collect(Collectors.toList());
    }

    public PrestadorTrabajoDTO aceptarSolicitudPrestador(Long idSolicitud, String correo,
                                                         AceptarSolicitudPrestadorDTO dto) {
        Prestador prestador = resolverPrestadorPorCorreo(correo);
        SolicitudServicio solicitud = obtenerSolicitudDelPrestador(idSolicitud, prestador.getIdPrestador());

        if (!ESTADO_PENDIENTE.equalsIgnoreCase(
                solicitud.getEstado() != null ? solicitud.getEstado() : "")) {
            throw new RuntimeException("Esta solicitud ya fue respondida");
        }

        String direccion = resolverDireccionAtencion(prestador, dto);
        solicitud.setDireccionAtencion(direccion);
        solicitud.setEstado(ESTADO_CONFIRMADA);
        solicitudRepository.save(solicitud);

        reservaRepository.findBySolicitud_IdSolicitud(idSolicitud).ifPresent(reserva -> {
            reserva.setEstado(ESTADO_CONFIRMADA);
            reservaRepository.save(reserva);
        });

        notificarClienteCitaConfirmada(solicitud, prestadorDeSolicitud(solicitud, prestador));

        return mapearTrabajo(solicitud);
    }

    public PrestadorTrabajoDTO rechazarSolicitudPrestador(Long idSolicitud, String correo) {
        Prestador prestador = resolverPrestadorPorCorreo(correo);
        SolicitudServicio solicitud = obtenerSolicitudDelPrestador(idSolicitud, prestador.getIdPrestador());

        if (!ESTADO_PENDIENTE.equalsIgnoreCase(
                solicitud.getEstado() != null ? solicitud.getEstado() : "")) {
            throw new RuntimeException("Esta solicitud ya fue respondida");
        }

        solicitud.setEstado(ESTADO_RECHAZADA);
        solicitudRepository.save(solicitud);

        reservaRepository.findBySolicitud_IdSolicitud(idSolicitud).ifPresent(reserva -> {
            reserva.setEstado(ESTADO_RECHAZADA);
            reservaRepository.save(reserva);
        });

        notificarClienteCitaRechazada(solicitud, prestadorDeSolicitud(solicitud, prestador));

        return mapearTrabajo(solicitud);
    }

    private Prestador resolverPrestadorPorCorreo(String correo) {
        return usuarioRepository
                .findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(
                        UsuarioRepository.normalizarCorreo(correo))
                .flatMap(usuario -> prestadorRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()))
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));
    }

    private SolicitudServicio obtenerSolicitudDelPrestador(Long idSolicitud, Long idPrestador) {
        SolicitudServicio solicitud = solicitudRepository.findWithRelacionesByIdSolicitud(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (solicitud.getServicio() == null
                || solicitud.getServicio().getPrestador() == null
                || !idPrestador.equals(solicitud.getServicio().getPrestador().getIdPrestador())) {
            throw new RuntimeException("No tienes permiso para gestionar esta solicitud");
        }

        return solicitud;
    }

    private String resolverDireccionAtencion(Prestador prestador, AceptarSolicitudPrestadorDTO dto) {
        if (dto != null && dto.getDireccionAtencion() != null && !dto.getDireccionAtencion().isBlank()) {
            return dto.getDireccionAtencion().trim();
        }
        if (prestador.getDireccionLocal() != null && !prestador.getDireccionLocal().isBlank()) {
            return prestador.getDireccionLocal().trim();
        }
        Usuario usuario = prestador.getUsuario();
        if (usuario != null && usuario.getDireccion() != null && !usuario.getDireccion().isBlank()) {
            return usuario.getDireccion().trim();
        }
        throw new RuntimeException("Debes indicar una dirección de atención para confirmar la cita");
    }

    private Prestador prestadorDeSolicitud(SolicitudServicio solicitud, Prestador prestadorFallback) {
        if (solicitud.getServicio() != null && solicitud.getServicio().getPrestador() != null) {
            return solicitud.getServicio().getPrestador();
        }
        return prestadorFallback;
    }

    private void notificarClienteCitaConfirmada(SolicitudServicio solicitud, Prestador prestador) {
        String correoCliente = correoCliente(solicitud);
        if (correoCliente == null) {
            return;
        }
        emailService.enviarCitaConfirmadaClienteAsync(
                correoCliente,
                nombreCliente(solicitud),
                nombreEspecialista(prestador),
                nombreServicio(solicitud),
                fechaTexto(solicitud),
                solicitud.getDireccionAtencion() != null ? solicitud.getDireccionAtencion() : "—"
        );
    }

    private void notificarClienteCitaRechazada(SolicitudServicio solicitud, Prestador prestador) {
        String correoCliente = correoCliente(solicitud);
        if (correoCliente == null) {
            return;
        }
        emailService.enviarCitaRechazadaClienteAsync(
                correoCliente,
                nombreCliente(solicitud),
                nombreEspecialista(prestador),
                nombreServicio(solicitud),
                fechaTexto(solicitud)
        );
    }

    private String correoCliente(SolicitudServicio solicitud) {
        if (solicitud.getCliente() == null || solicitud.getCliente().getUsuario() == null) {
            return null;
        }
        String correo = solicitud.getCliente().getUsuario().getCorreo();
        if (correo == null || correo.isBlank()) {
            return null;
        }
        return correo.trim();
    }

    private String nombreCliente(SolicitudServicio solicitud) {
        if (solicitud.getCliente() == null || solicitud.getCliente().getUsuario() == null) {
            return "";
        }
        Usuario usuario = solicitud.getCliente().getUsuario();
        String nombre = usuario.getNombre() != null ? usuario.getNombre() : "";
        String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
        return (nombre + " " + apellido).trim();
    }

    private String nombreServicio(SolicitudServicio solicitud) {
        if (solicitud.getServicio() == null || solicitud.getServicio().getNombre() == null) {
            return "Servicio";
        }
        return solicitud.getServicio().getNombre();
    }

    private String fechaTexto(SolicitudServicio solicitud) {
        if (solicitud.getFechaHoraPreferida() == null) {
            return "Por confirmar";
        }
        return solicitud.getFechaHoraPreferida().format(FECHA_FMT);
    }

    private String nombreEspecialista(Prestador prestador) {
        if (prestador == null) {
            return "El especialista";
        }
        if (prestador.getEmpresa() != null) {
            String razon = prestador.getEmpresa().getRazonSocial();
            if (razon != null && !razon.isBlank()) {
                return razon.trim();
            }
            String comercial = prestador.getEmpresa().getNombreComercial();
            if (comercial != null && !comercial.isBlank()) {
                return comercial.trim();
            }
        }
        Usuario usuario = prestador.getUsuario();
        if (usuario == null) {
            return "El especialista";
        }
        String nombre = usuario.getNombre() != null ? usuario.getNombre() : "";
        String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
        String completo = (nombre + " " + apellido).trim();
        return completo.isEmpty() ? "El especialista" : completo;
    }

    private PrestadorTrabajoDTO mapearTrabajo(SolicitudServicio solicitud) {
        PrestadorTrabajoDTO dto = new PrestadorTrabajoDTO();
        dto.setIdSolicitud(solicitud.getIdSolicitud());
        dto.setEstado(solicitud.getEstado());
        dto.setDireccionAtencion(solicitud.getDireccionAtencion());

        if (solicitud.getFechaHoraPreferida() != null) {
            dto.setFechaPreferida(solicitud.getFechaHoraPreferida().format(FECHA_FMT));
        }

        if (solicitud.getServicio() != null) {
            dto.setServicioNombre(solicitud.getServicio().getNombre());
            dto.setDescripcion(solicitud.getServicio().getDescripcion());
        }

        if (solicitud.getCliente() != null && solicitud.getCliente().getUsuario() != null) {
            var usuario = solicitud.getCliente().getUsuario();
            String nombre = usuario.getNombre() != null ? usuario.getNombre() : "";
            String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
            dto.setClienteNombre((nombre + " " + apellido).trim());
        }

        return dto;
    }

    public SolicitudServicio obtenerSolicitudPorId(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public SolicitudServicio crearSolicitud(SolicitudServicio solicitud) {

        // 🔥 Validar cliente
        if (solicitud.getCliente() == null || solicitud.getCliente().getIdCliente() == null) {
            throw new RuntimeException("Debe enviar idCliente");
        }

        // 🔥 Validar servicio
        if (solicitud.getServicio() == null || solicitud.getServicio().getIdServicio() == null) {
            throw new RuntimeException("Debe enviar idServicio");
        }

        Cliente cliente = clienteRepository
                .findById(solicitud.getCliente().getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Servicio servicio = servicioRepository
                .findById(solicitud.getServicio().getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        solicitud.setCliente(cliente);
        solicitud.setServicio(servicio);

        return solicitudRepository.save(solicitud);
    }

    public SolicitudServicio actualizarSolicitud(Long id, SolicitudServicio solicitudActualizada) {

        SolicitudServicio solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setFechaHoraSolicitud(solicitudActualizada.getFechaHoraSolicitud());
        solicitud.setFechaHoraPreferida(solicitudActualizada.getFechaHoraPreferida());
        solicitud.setDireccionAtencion(solicitudActualizada.getDireccionAtencion());
        solicitud.setEstado(solicitudActualizada.getEstado());
        solicitud.setObservacion(solicitudActualizada.getObservacion());

        return solicitudRepository.save(solicitud);
    }

    public void eliminarSolicitud(Long id) {
        if (!solicitudRepository.existsById(id)) {
            throw new RuntimeException("Solicitud no encontrada");
        }
        solicitudRepository.deleteById(id);
    }
}