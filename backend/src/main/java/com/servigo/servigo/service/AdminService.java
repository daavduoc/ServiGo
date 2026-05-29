package com.servigo.servigo.service;

import com.servigo.servigo.dto.*;
import com.servigo.servigo.entity.*;
import com.servigo.servigo.repository.*;
import com.servigo.servigo.util.CloudinaryUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PrestadorRepository prestadorRepository;
    private final ClienteRepository clienteRepository;
    private final SolicitudServicioRepository solicitudServicioRepository;
    private final ReservaRepository reservaRepository;
    private final ResenaRepository resenaRepository;
    private final ServicioRepository servicioRepository;
    private final CertificacionRepository certificacionRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final RolRepository rolRepository;
    private final EmpresaRepository empresaRepository;
    private final FotoPerfilRepository fotoPerfilRepository;
    private final MensajeSoporteRepository mensajeSoporteRepository;

    public AdminService(
            UsuarioRepository usuarioRepository,
            PrestadorRepository prestadorRepository,
            ClienteRepository clienteRepository,
            SolicitudServicioRepository solicitudServicioRepository,
            ReservaRepository reservaRepository,
            ResenaRepository resenaRepository,
            ServicioRepository servicioRepository,
            CertificacionRepository certificacionRepository,
            AuditoriaRepository auditoriaRepository,
            RolRepository rolRepository,
            EmpresaRepository empresaRepository,
            FotoPerfilRepository fotoPerfilRepository,
            MensajeSoporteRepository mensajeSoporteRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.prestadorRepository = prestadorRepository;
        this.clienteRepository = clienteRepository;
        this.solicitudServicioRepository = solicitudServicioRepository;
        this.reservaRepository = reservaRepository;
        this.resenaRepository = resenaRepository;
        this.servicioRepository = servicioRepository;
        this.certificacionRepository = certificacionRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.rolRepository = rolRepository;
        this.empresaRepository = empresaRepository;
        this.fotoPerfilRepository = fotoPerfilRepository;
        this.mensajeSoporteRepository = mensajeSoporteRepository;
    }

    public AdminDashboardStatsDTO obtenerEstadisticasDashboard() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();

        stats.setTotalUsuarios(usuarioRepository.count());
        stats.setTotalPrestadores(prestadorRepository.count());
        stats.setTotalClientes(clienteRepository.count());

        stats.setSolicitudesPendientes(solicitudServicioRepository.countByEstado("pendiente_validacion_cliente"));
        stats.setSolicitudesAprobadas(solicitudServicioRepository.countByEstado("aprobada"));
        stats.setSolicitudesRechazadas(solicitudServicioRepository.countByEstado("rechazada"));

        stats.setReservasConfirmadas(reservaRepository.countByEstado("confirmada"));
        stats.setReservasFinalizadas(reservaRepository.countByEstado("finalizada"));

        Double promedioCalificacion = resenaRepository.findAll()
                .stream()
                .mapToInt(Resena::getPuntuacion)
                .average()
                .orElse(0.0);

        stats.setPromedioCalificacion(promedioCalificacion);

        stats.setPrestadoresValidados(prestadorRepository.countByEstadoValidacion("validado"));
        stats.setPrestadoresPendientes(prestadorRepository.countByEstadoValidacion("pendiente"));

        stats.setUsuariosActivos(usuarioRepository.countByEstado("activo"));
        stats.setUsuariosBloqueados(usuarioRepository.countByEstado("bloqueado"));
        stats.setUsuariosInactivos(usuarioRepository.countByEstado("inactivo"));

        stats.setSoportePendientes(mensajeSoporteRepository.countByEstado("pendiente"));
        stats.setSoporteEnProceso(mensajeSoporteRepository.countByEstado("en_proceso"));
        stats.setSoporteResueltos(mensajeSoporteRepository.countByEstado("resuelto"));

        return stats;
    }

    public List<AdminUsuarioDTO> listarUsuariosCompleto(int page, int size, String rol, String estado) {

        List<Usuario> usuarios;

        if (rol != null && !rol.isEmpty() && estado != null && !estado.isEmpty()) {
            Rol rolEntity = rolRepository.findByNombre(rol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuarios = usuarioRepository.findByRolAndEstado(rolEntity, estado);

        } else if (rol != null && !rol.isEmpty()) {
            Rol rolEntity = rolRepository.findByNombre(rol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuarios = usuarioRepository.findByRol(rolEntity);

        } else if (estado != null && !estado.isEmpty()) {
            usuarios = usuarioRepository.findByEstado(estado);

        } else {
            usuarios = usuarioRepository.findAll();
        }

        return usuarios.stream()
                .map(this::convertToAdminUsuarioDTO)
                .collect(Collectors.toList());
    }

    public AdminUsuarioDTO obtenerUsuarioCompleto(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return convertToAdminUsuarioDTO(usuario);
    }

    public void bloquearUsuario(Long idUsuario, String motivo, Long idAdmin) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String valorAnterior = usuario.getEstado();
        usuario.setEstado("bloqueado");
        usuarioRepository.save(usuario);

        registrarAuditoria(idAdmin, "BLOQUEAR", "USUARIO", idUsuario, valorAnterior, "bloqueado", motivo);
    }

    public void desbloquearUsuario(Long idUsuario, Long idAdmin) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String valorAnterior = usuario.getEstado();
        usuario.setEstado("activo");
        usuarioRepository.save(usuario);

        registrarAuditoria(idAdmin, "DESBLOQUEAR", "USUARIO", idUsuario, valorAnterior, "activo", null);
    }

    public void desactivarUsuario(Long idUsuario, String motivo, Long idAdmin) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String valorAnterior = usuario.getEstado();
        usuario.setEstado("inactivo");
        usuarioRepository.save(usuario);

        registrarAuditoria(idAdmin, "DESACTIVAR", "USUARIO", idUsuario, valorAnterior, "inactivo", motivo);
    }

    public List<AdminPrestadorValidacionDTO> listarPrestadoresValidacion() {
        return prestadorRepository.findByEstadoValidacion("pendiente")
                .stream()
                .map(this::convertToListItemPrestador)
                .collect(Collectors.toList());
    }

    public AdminPrestadorValidacionDTO obtenerPrestadorCompleto(Long idPrestador) {
        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        return convertToAdminPrestadorValidacionDTO(prestador);
    }

    public void aprobarPrestador(Long idPrestador, Long idAdmin) {
        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        String valorAnterior = prestador.getEstadoValidacion();
        prestador.setEstadoValidacion("validado");
        prestadorRepository.save(prestador);

        if (prestador.getEmpresa() != null) {
            Empresa empresa = prestador.getEmpresa();
            String estadoEmpresaAnterior = empresa.getEstado();
            empresa.setEstado("activo");
            empresaRepository.save(empresa);
            registrarAuditoria(
                    idAdmin,
                    "APROBAR_EMPRESA",
                    "EMPRESA",
                    empresa.getIdEmpresa(),
                    estadoEmpresaAnterior,
                    "activo",
                    null
            );
        }

        registrarAuditoria(idAdmin, "APROBAR", "PRESTADOR", idPrestador, valorAnterior, "validado", null);
    }

    public void rechazarPrestador(Long idPrestador, String motivo, Long idAdmin) {
        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        String valorAnterior = prestador.getEstadoValidacion();
        prestador.setEstadoValidacion("rechazado");
        prestadorRepository.save(prestador);

        registrarAuditoria(idAdmin, "RECHAZAR", "PRESTADOR", idPrestador, valorAnterior, "rechazado", motivo);
    }

    public List<Certificacion> obtenerCertificacionesPrestador(Long idPrestador) {
        prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        return certificacionRepository.findByPrestadorIdPrestador(idPrestador);
    }

    public List<AdminSolicitudDTO> listarSolicitudesAdmin(String estado, int page, int size) {

        List<SolicitudServicio> solicitudes;

        if (estado != null && !estado.isEmpty()) {
            solicitudes = solicitudServicioRepository.findByEstado(estado);
        } else {
            solicitudes = solicitudServicioRepository.findAll();
        }

        return solicitudes.stream()
                .map(this::convertToAdminSolicitudDTO)
                .collect(Collectors.toList());
    }

    public void actualizarEstadoSolicitud(Long idSolicitud, String nuevoEstado, Long idAdmin) {
        SolicitudServicio solicitud = solicitudServicioRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        String valorAnterior = solicitud.getEstado();
        solicitud.setEstado(nuevoEstado);
        solicitudServicioRepository.save(solicitud);

        registrarAuditoria(idAdmin, "ACTUALIZAR_ESTADO", "SOLICITUD_SERVICIO", idSolicitud, valorAnterior, nuevoEstado, null);
    }

    public AdminReporteDTO generarReportePeriodo(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        AdminReporteDTO reporte = new AdminReporteDTO();

        reporte.setFechaInicio(fechaInicio.toLocalDate());
        reporte.setFechaFin(fechaFin.toLocalDate());

        // ========================
        // SOLICITUDES DE SERVICIO
        // ========================
        List<SolicitudServicio> solicitudesPeriodo =
                solicitudServicioRepository.findByFechaHoraSolicitudBetween(fechaInicio, fechaFin);

        reporte.setTotalSolicitudes((long) solicitudesPeriodo.size());
        reporte.setSolicitudesAprobadas(solicitudesPeriodo.stream()
                .filter(s -> "aprobada".equals(s.getEstado())).count());
        reporte.setSolicitudesRechazadas(solicitudesPeriodo.stream()
                .filter(s -> "rechazada".equals(s.getEstado())).count());
        reporte.setSolicitudesCanceladas(solicitudesPeriodo.stream()
                .filter(s -> "cancelada".equals(s.getEstado())).count());

        // ========================
        // ESPECIALIDAD MAS UTILIZADA
        // ========================
        Map<String, Long> especialidades = solicitudesPeriodo.stream()
                .filter(s -> s.getServicio() != null && s.getServicio().getEspecialidad() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getServicio().getEspecialidad().getNombre(),
                        Collectors.counting()
                ));

        Optional<Map.Entry<String, Long>> topEspecialidad = especialidades.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (topEspecialidad.isPresent()) {
            reporte.setEspecialidadMasUtilizada(topEspecialidad.get().getKey());
            reporte.setSolicitudesPorEspecialidad(topEspecialidad.get().getValue().intValue());
        }

        // ========================
        // RESERVAS
        // ========================
        List<Reserva> reservasPeriodo =
                reservaRepository.findByFechaCreacionReservaBetween(fechaInicio, fechaFin);

        reporte.setTotalReservas((long) reservasPeriodo.size());
        reporte.setReservasFinalizadas(reservasPeriodo.stream()
                .filter(r -> "finalizada".equals(r.getEstado())).count());
        reporte.setReservasCanceladas(reservasPeriodo.stream()
                .filter(r -> "cancelada".equals(r.getEstado())).count());

        // ========================
        // INGRESO ESTIMADO (suma de precioReferencial de reservas finalizadas)
        // ========================
        BigDecimal ingreso = reservasPeriodo.stream()
                .filter(r -> "finalizada".equals(r.getEstado()))
                .filter(r -> r.getSolicitud() != null
                        && r.getSolicitud().getServicio() != null)
                .map(r -> BigDecimal.valueOf(
                        r.getSolicitud().getServicio().getPrecioReferencial() != null
                                ? r.getSolicitud().getServicio().getPrecioReferencial()
                                : 0.0))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        reporte.setIngresoEstimado(ingreso);

        // ========================
        // USUARIOS NUEVOS (por periodo y por rol)
        // ========================
        List<Usuario> usuariosPeriodo = usuarioRepository.findAll()
                .stream()
                .filter(u -> u.getFechaRegistro() != null
                        && u.getFechaRegistro().isAfter(fechaInicio)
                        && u.getFechaRegistro().isBefore(fechaFin))
                .collect(Collectors.toList());

        reporte.setNuevosUsuarios((long) usuariosPeriodo.size());

        reporte.setNuevosPrestadores(usuariosPeriodo.stream()
                .filter(u -> u.getRol() != null && "PRESTADOR".equals(u.getRol().getNombre()))
                .count());

        reporte.setNuevosClientes(usuariosPeriodo.stream()
                .filter(u -> u.getRol() != null && "CLIENTE".equals(u.getRol().getNombre()))
                .count());

        // ========================
        // VALIDACION DE PRESTADORES (por periodo de registro)
        // ========================
        List<Prestador> prestadoresPeriodo = prestadorRepository.findAll()
                .stream()
                .filter(p -> p.getUsuario() != null
                        && p.getUsuario().getFechaRegistro() != null
                        && p.getUsuario().getFechaRegistro().isAfter(fechaInicio)
                        && p.getUsuario().getFechaRegistro().isBefore(fechaFin))
                .collect(Collectors.toList());

        reporte.setPrestadoresValidados(prestadoresPeriodo.stream()
                .filter(p -> "validado".equals(p.getEstadoValidacion()))
                .count());

        reporte.setPrestadoresPendientes(prestadoresPeriodo.stream()
                .filter(p -> "pendiente".equals(p.getEstadoValidacion()))
                .count());

        reporte.setPrestadoresRechazados(prestadoresPeriodo.stream()
                .filter(p -> "rechazado".equals(p.getEstadoValidacion()))
                .count());

        // ========================
        // RESENAS
        // ========================
        List<Resena> resenasPeriodo = resenaRepository.findAll()
                .stream()
                .filter(r -> r.getFechaResena().isAfter(fechaInicio)
                        && r.getFechaResena().isBefore(fechaFin))
                .collect(Collectors.toList());

        reporte.setTotalReseñas((long) resenasPeriodo.size());

        Double promedio = resenasPeriodo.stream()
                .mapToInt(Resena::getPuntuacion)
                .average()
                .orElse(0.0);

        reporte.setPromedioCalificacionesReseñas(promedio);

        return reporte;
    }

    public List<AdminAuditoriaDTO> obtenerHistorialAuditoria(int page, int size, String accion, String tabla) {

        List<Auditoria> auditorias;

        if (accion != null && !accion.isEmpty() && tabla != null && !tabla.isEmpty()) {
            auditorias = auditoriaRepository.findAll()
                    .stream()
                    .filter(a -> a.getAccion().equals(accion) && a.getTablaAfectada().equals(tabla))
                    .sorted((a, b) -> b.getFechaHora().compareTo(a.getFechaHora()))
                    .collect(Collectors.toList());

        } else if (accion != null && !accion.isEmpty()) {
            auditorias = auditoriaRepository.findByAccionOrderByFechaHoraDesc(accion);

        } else if (tabla != null && !tabla.isEmpty()) {
            auditorias = auditoriaRepository.findByTablaAfectadaOrderByFechaHoraDesc(tabla);

        } else {
            auditorias = auditoriaRepository.findAll()
                    .stream()
                    .sorted((a, b) -> b.getFechaHora().compareTo(a.getFechaHora()))
                    .collect(Collectors.toList());
        }

        return auditorias.stream()
                .map(this::convertToAdminAuditoriaDTO)
                .collect(Collectors.toList());
    }

    private AdminUsuarioDTO convertToAdminUsuarioDTO(Usuario usuario) {
        AdminUsuarioDTO dto = new AdminUsuarioDTO();

        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setRut(usuario.getRut());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        Rol rol = usuario.getRol();
        dto.setRol(rol != null && rol.getNombre() != null ? rol.getNombre() : "SIN_ROL");
        dto.setEstado(usuario.getEstado() != null ? usuario.getEstado() : "desconocido");
        dto.setRegion(usuario.getRegion());
        dto.setComuna(usuario.getComuna());
        dto.setCorreoValidado(usuario.getCorreoValidado());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setUltimaActividad(usuario.getUltimaActividad());

        return dto;
    }

    /** Listado rápido: sin consultas por servicios ni foto. */
    private AdminPrestadorValidacionDTO convertToListItemPrestador(Prestador prestador) {
        AdminPrestadorValidacionDTO dto = mapDatosBasePrestador(prestador);
        dto.setCertificacionesCount(
                (int) certificacionRepository.countByPrestadorIdPrestador(prestador.getIdPrestador())
        );
        return dto;
    }

    private AdminPrestadorValidacionDTO convertToAdminPrestadorValidacionDTO(Prestador prestador) {
        AdminPrestadorValidacionDTO dto = mapDatosBasePrestador(prestador);

        fotoPerfilRepository.findByUsuario_IdUsuario(prestador.getUsuario().getIdUsuario())
                .ifPresent(foto -> dto.setUrlFotoPerfil(
                        CloudinaryUtil.urlMiniatura(foto.getUrlFotoCloud())
                ));

        dto.setCertificacionesCount(
                (int) certificacionRepository.countByPrestadorIdPrestador(prestador.getIdPrestador())
        );

        return dto;
    }

    private AdminPrestadorValidacionDTO mapDatosBasePrestador(Prestador prestador) {
        AdminPrestadorValidacionDTO dto = new AdminPrestadorValidacionDTO();
        Usuario usuario = prestador.getUsuario();

        dto.setIdPrestador(prestador.getIdPrestador());
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setEmail(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setRut(usuario.getRut());
        dto.setDireccion(usuario.getDireccion());
        dto.setComuna(usuario.getComuna());
        dto.setRegion(usuario.getRegion());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setCorreoValidado(usuario.getCorreoValidado());

        if (prestador.getEmpresa() != null) {
            Empresa empresa = prestador.getEmpresa();
            dto.setNombrePrestador(
                    empresa.getRazonSocial() != null
                            ? empresa.getRazonSocial()
                            : empresa.getNombreComercial()
            );
            dto.setEmpresa(dto.getNombrePrestador());
            dto.setNombreComercial(empresa.getNombreComercial());
            dto.setRutEmpresa(empresa.getRutEmpresa());
            dto.setGiroComercial(empresa.getGiroComercial());
            dto.setEstadoEmpresa(empresa.getEstado());
        } else {
            String apellido = usuario.getApellido() != null ? usuario.getApellido().trim() : "";
            dto.setNombrePrestador(
                    (usuario.getNombre() + (apellido.isEmpty() || "-".equals(apellido) ? "" : " " + apellido)).trim()
            );
        }

        dto.setEspecialidad(
                prestador.getEspecialidad() != null && !prestador.getEspecialidad().isBlank()
                        ? prestador.getEspecialidad()
                        : null
        );

        dto.setCategoriaPrestador(
                prestador.getCategoriaPrestador() != null
                        ? prestador.getCategoriaPrestador().getNombre()
                        : "N/A"
        );

        dto.setTipoPrestador(prestador.getTipoPrestador());
        dto.setDescripcion(prestador.getDescripcion());
        dto.setExperiencia(prestador.getExperiencia());
        dto.setEstadoValidacion(prestador.getEstadoValidacion());
        dto.setDireccionLocal(prestador.getDireccionLocal());

        return dto;
    }

    private AdminSolicitudDTO convertToAdminSolicitudDTO(SolicitudServicio solicitud) {
        AdminSolicitudDTO dto = new AdminSolicitudDTO();

        dto.setIdSolicitud(solicitud.getIdSolicitud());
        dto.setIdCliente(solicitud.getCliente().getIdCliente());
        dto.setNombreCliente(solicitud.getCliente().getUsuario().getNombre());
        dto.setEmailCliente(solicitud.getCliente().getUsuario().getCorreo());
        dto.setIdServicio(solicitud.getServicio().getIdServicio());
        dto.setNombreServicio(solicitud.getServicio().getNombre());
        dto.setIdPrestador(solicitud.getServicio().getPrestador().getIdPrestador());
        dto.setNombrePrestador(solicitud.getServicio().getPrestador().getUsuario().getNombre());
        dto.setEspecialidad(solicitud.getServicio().getEspecialidad().getNombre());
        dto.setFechaHoraSolicitud(solicitud.getFechaHoraSolicitud());
        dto.setFechaHoraPreferida(solicitud.getFechaHoraPreferida());
        dto.setDireccionAtencion(solicitud.getDireccionAtencion());
        dto.setEstado(solicitud.getEstado());
        dto.setObservacion(solicitud.getObservacion());

        return dto;
    }

    private AdminAuditoriaDTO convertToAdminAuditoriaDTO(Auditoria auditoria) {
        AdminAuditoriaDTO dto = new AdminAuditoriaDTO();

        dto.setIdAuditoria(auditoria.getIdAuditoria());
        dto.setIdAdmin(auditoria.getIdAdmin());
        dto.setAccion(auditoria.getAccion());
        dto.setTablaAfectada(auditoria.getTablaAfectada());
        dto.setRegistroId(auditoria.getRegistroId());
        dto.setValorAnterior(auditoria.getValorAnterior());
        dto.setValorNuevo(auditoria.getValorNuevo());
        dto.setFechaHora(auditoria.getFechaHora());
        dto.setDetalles(auditoria.getDetalles());

        usuarioRepository.findById(auditoria.getIdAdmin())
                .ifPresent(admin -> dto.setNombreAdmin(admin.getNombre()));

        // Obtener email del usuario afectado
        if ("USUARIO".equals(auditoria.getTablaAfectada())) {
            usuarioRepository.findById(auditoria.getRegistroId())
                    .ifPresent(usuario -> dto.setEmail(usuario.getCorreo()));
        } else if ("PRESTADOR".equals(auditoria.getTablaAfectada())) {
            prestadorRepository.findById(auditoria.getRegistroId())
                    .ifPresent(prestador -> dto.setEmail(prestador.getUsuario().getCorreo()));
        }        

        return dto;
    }

    // ========================
    // SOPORTE / MENSAJES
    // ========================

    public List<AdminMensajeSoporteDTO> listarMensajesSoporte(String estado, String rolRemitente) {
        List<MensajeSoporte> mensajes;

        if (estado != null && !estado.isEmpty() && rolRemitente != null && !rolRemitente.isEmpty()) {
            mensajes = mensajeSoporteRepository.findByEstadoAndRolRemitenteOrderByFechaCreacionDesc(estado, rolRemitente);
        } else if (estado != null && !estado.isEmpty()) {
            mensajes = mensajeSoporteRepository.findByEstadoOrderByFechaCreacionDesc(estado);
        } else if (rolRemitente != null && !rolRemitente.isEmpty()) {
            mensajes = mensajeSoporteRepository.findByRolRemitenteOrderByFechaCreacionDesc(rolRemitente);
        } else {
            mensajes = mensajeSoporteRepository.findAllByOrderByFechaCreacionDesc();
        }

        return mensajes.stream()
                .map(this::convertToAdminMensajeSoporteDTO)
                .collect(Collectors.toList());
    }

    public void actualizarEstadoMensaje(Long idMensaje, String nuevoEstado, Long idAdmin) {
        MensajeSoporte mensaje = mensajeSoporteRepository.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje de soporte no encontrado"));

        String valorAnterior = mensaje.getEstado();
        mensaje.setEstado(nuevoEstado);
        mensaje.setFechaActualizacion(LocalDateTime.now());
        mensajeSoporteRepository.save(mensaje);

        registrarAuditoria(idAdmin, "ACTUALIZAR_ESTADO", "MENSAJE_SOPORTE", idMensaje, valorAnterior, nuevoEstado, null);
    }

    public void responderMensajeSoporte(Long idMensaje, String respuesta, Long idAdmin) {
        MensajeSoporte mensaje = mensajeSoporteRepository.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje de soporte no encontrado"));

        String valorAnterior = mensaje.getEstado();
        mensaje.setRespuesta(respuesta);
        mensaje.setEstado("en_proceso");
        mensaje.setFechaActualizacion(LocalDateTime.now());
        mensajeSoporteRepository.save(mensaje);

        registrarAuditoria(idAdmin, "RESPONDER_SOPORTE", "MENSAJE_SOPORTE", idMensaje, valorAnterior, "en_proceso", null);
    }

    public void eliminarMensajeSoporte(Long idMensaje, Long idAdmin) {
        MensajeSoporte mensaje = mensajeSoporteRepository.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje de soporte no encontrado"));

        mensajeSoporteRepository.delete(mensaje);

        registrarAuditoria(idAdmin, "ELIMINAR", "MENSAJE_SOPORTE", idMensaje, mensaje.getEstado(), null, null);
    }

    private AdminMensajeSoporteDTO convertToAdminMensajeSoporteDTO(MensajeSoporte mensaje) {
        AdminMensajeSoporteDTO dto = new AdminMensajeSoporteDTO();

        dto.setIdMensaje(mensaje.getIdMensaje());
        dto.setIdUsuario(mensaje.getUsuario().getIdUsuario());
        dto.setNombreRemitente(
                mensaje.getUsuario().getNombre() + " " + (mensaje.getUsuario().getApellido() != null ? mensaje.getUsuario().getApellido() : "")
        );
        dto.setCorreoRemitente(mensaje.getUsuario().getCorreo());
        dto.setRolRemitente(mensaje.getRolRemitente());
        dto.setTipoProblema(mensaje.getTipoProblema());
        dto.setAsunto(mensaje.getAsunto());
        dto.setDescripcion(mensaje.getDescripcion());
        dto.setEstado(mensaje.getEstado());
        dto.setRespuesta(mensaje.getRespuesta());
        dto.setFechaCreacion(mensaje.getFechaCreacion());
        dto.setFechaActualizacion(mensaje.getFechaActualizacion());

        return dto;
    }

    private void registrarAuditoria(
            Long idAdmin,
            String accion,
            String tabla,
            Long registroId,
            String valorAnterior,
            String valorNuevo,
            String detalles
    ) {
        Auditoria auditoria = new Auditoria();

        auditoria.setIdAdmin(idAdmin);
        auditoria.setAccion(accion);
        auditoria.setTablaAfectada(tabla);
        auditoria.setRegistroId(registroId);
        auditoria.setValorAnterior(valorAnterior);
        auditoria.setValorNuevo(valorNuevo);
        auditoria.setFechaHora(LocalDateTime.now());
        auditoria.setDetalles(detalles);

        auditoriaRepository.save(auditoria);
    }

    public List<AdminUsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertToAdminUsuarioDTO)
                .collect(Collectors.toList());
    }
}