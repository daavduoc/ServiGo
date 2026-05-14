package com.servigo.servigo.service;

import com.servigo.servigo.dto.AdminUsuarioDTO;
import com.servigo.servigo.dto.AdminDashboardStatsDTO;
import com.servigo.servigo.dto.AdminPrestadorValidacionDTO;
import com.servigo.servigo.dto.AdminSolicitudDTO;
import com.servigo.servigo.dto.AdminReporteDTO;
import com.servigo.servigo.dto.AdminAuditoriaDTO;
import com.servigo.servigo.entity.*;
import com.servigo.servigo.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class AdminService {
    
    private final UsuarioRepository usuarioRepository;
    private final PrestadorRepository prestadorRepository;
    private final ClienteRepository clienteRepository;
    private final SolicitudServicioRepository solicitudServicioRepository;
    private final ReservaRepository reservaRepository;
    private final ResenaRepository resenaRepository;
    private final ServicioRepository servicioRepository;
    private final EspecialidadRepository especialidadRepository;
    private final CertificacionRepository certificacionRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final RolRepository rolRepository;
    private final ObjectMapper objectMapper;
    
    public AdminService(
            UsuarioRepository usuarioRepository,
            PrestadorRepository prestadorRepository,
            ClienteRepository clienteRepository,
            SolicitudServicioRepository solicitudServicioRepository,
            ReservaRepository reservaRepository,
            ResenaRepository resenaRepository,
            ServicioRepository servicioRepository,
            EspecialidadRepository especialidadRepository,
            CertificacionRepository certificacionRepository,
            AuditoriaRepository auditoriaRepository,
            RolRepository rolRepository,
            ObjectMapper objectMapper) {
        this.usuarioRepository = usuarioRepository;
        this.prestadorRepository = prestadorRepository;
        this.clienteRepository = clienteRepository;
        this.solicitudServicioRepository = solicitudServicioRepository;
        this.reservaRepository = reservaRepository;
        this.resenaRepository = resenaRepository;
        this.servicioRepository = servicioRepository;
        this.especialidadRepository = especialidadRepository;
        this.certificacionRepository = certificacionRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.rolRepository = rolRepository;
        this.objectMapper = objectMapper;
    }
    
    // ========================
    // MÉTODOS DE ESTADÍSTICAS
    // ========================
    
    public AdminDashboardStatsDTO obtenerEstadisticasDashboard() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();
        
        stats.setTotalUsuarios(usuarioRepository.count());
        stats.setTotalPrestadores(prestadorRepository.count());
        stats.setTotalClientes(clienteRepository.count());
        
        // Solicitudes
        long solicitudesPendientes = solicitudServicioRepository.countByEstado("pendiente_validacion_cliente");
        long solicitudesAprobadas = solicitudServicioRepository.countByEstado("aprobada");
        long solicitudesRechazadas = solicitudServicioRepository.countByEstado("rechazada");
        
        stats.setSolicitudesPendientes(solicitudesPendientes);
        stats.setSolicitudesAprobadas(solicitudesAprobadas);
        stats.setSolicitudesRechazadas(solicitudesRechazadas);
        
        // Reservas
        long reservasConfirmadas = reservaRepository.countByEstado("confirmada");
        long reservasFinalizadas = reservaRepository.countByEstado("finalizada");
        
        stats.setReservasConfirmadas(reservasConfirmadas);
        stats.setReservasFinalizadas(reservasFinalizadas);
        
        // Reseñas
        List<Resena> todasReseñas = resenaRepository.findAll();
        Double promedioCalificacion = todasReseñas.stream()
                .mapToInt(Resena::getPuntuacion)
                .average()
                .orElse(0.0);
        stats.setPromedioCalificacion(promedioCalificacion);
        
        // Prestadores por validación
        long prestadoresValidados = prestadorRepository.countByEstadoValidacion("validado");
        long prestadoresPendientes = prestadorRepository.countByEstadoValidacion("pendiente");
        
        stats.setPrestadoresValidados(prestadoresValidados);
        stats.setPrestadoresPendientes(prestadoresPendientes);
        
        // Usuarios por estado
        long usuariosActivos = usuarioRepository.countByEstado("activo");
        long usuariosBloqueados = usuarioRepository.countByEstado("bloqueado");
        long usuariosInactivos = usuarioRepository.countByEstado("inactivo");
        
        stats.setUsuariosActivos(usuariosActivos);
        stats.setUsuariosBloqueados(usuariosBloqueados);
        stats.setUsuariosInactivos(usuariosInactivos);
        
        return stats;
    }
    
    // ========================
    // GESTIÓN DE USUARIOS
    // ========================
    
    public List<AdminUsuarioDTO> listarUsuariosCompleto(int page, int size, String rol, String estado) {
        Pageable pageable = PageRequest.of(page, size);
        
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
    
    // ========================
    // GESTIÓN DE PRESTADORES
    // ========================
    
    public List<AdminPrestadorValidacionDTO> listarPrestadoresValidacion() {
        List<Prestador> prestadoresPendientes = prestadorRepository.findByEstadoValidacion("pendiente");
        return prestadoresPendientes.stream()
                .map(this::convertToAdminPrestadorValidacionDTO)
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
        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));
        return certificacionRepository.findByPrestador(prestador);
    }
    
    // ========================
    // GESTIÓN DE SOLICITUDES
    // ========================
    
    public List<AdminSolicitudDTO> listarSolicitudesAdmin(String estado, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
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
    
    // ========================
    // REPORTES
    // ========================
    
    public AdminReporteDTO generarReportePeriodo(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        AdminReporteDTO reporte = new AdminReporteDTO();
        reporte.setFechaInicio(fechaInicio.toLocalDate());
        reporte.setFechaFin(fechaFin.toLocalDate());
        
        // Solicitudes en el período
        List<SolicitudServicio> solicitudesPeriodo = solicitudServicioRepository
                .findByFechaHoraSolicitudBetween(fechaInicio, fechaFin);
        
        reporte.setTotalSolicitudes((long) solicitudesPeriodo.size());
        reporte.setSolicitudesAprobadas(solicitudesPeriodo.stream()
                .filter(s -> "aprobada".equals(s.getEstado()))
                .count());
        reporte.setSolicitudesRechazadas(solicitudesPeriodo.stream()
                .filter(s -> "rechazada".equals(s.getEstado()))
                .count());
        reporte.setSolicitudesCanceladas(solicitudesPeriodo.stream()
                .filter(s -> "cancelada".equals(s.getEstado()))
                .count());
        
        // Reservas en el período
        List<Reserva> reservasPeriodo = reservaRepository
                .findByFechaCreacionReservaBetween(fechaInicio, fechaFin);
        
        reporte.setTotalReservas((long) reservasPeriodo.size());
        reporte.setReservasFinalizadas(reservasPeriodo.stream()
                .filter(r -> "finalizada".equals(r.getEstado()))
                .count());
        reporte.setReservasCanceladas(reservasPeriodo.stream()
                .filter(r -> "cancelada".equals(r.getEstado()))
                .count());
        
        // Usuarios nuevos en el período
        List<Usuario> usuariosPeriodo = usuarioRepository.findAll().stream()
                .filter(u -> u.getFechaRegistro() != null &&
                           u.getFechaRegistro().isAfter(fechaInicio) &&
                           u.getFechaRegistro().isBefore(fechaFin))
                .collect(Collectors.toList());
        
        reporte.setNuevosUsuarios((long) usuariosPeriodo.size());
        
        // Reseñas en el período
        List<Resena> reseñasPeriodo = resenaRepository.findAll().stream()
                .filter(r -> r.getFechaResena().isAfter(fechaInicio) &&
                           r.getFechaResena().isBefore(fechaFin))
                .collect(Collectors.toList());
        
        reporte.setTotalReseñas((long) reseñasPeriodo.size());
        Double promedioCalificacion = reseñasPeriodo.stream()
                .mapToInt(Resena::getPuntuacion)
                .average()
                .orElse(0.0);
        reporte.setPromedioCalificacionesReseñas(promedioCalificacion);
        
        return reporte;
    }
    
    public List<AdminAuditoriaDTO> obtenerHistorialAuditoria(int page, int size, String accion, String tabla) {
        Pageable pageable = PageRequest.of(page, size);
        
        List<Auditoria> auditorias;
        if (accion != null && !accion.isEmpty() && tabla != null && !tabla.isEmpty()) {
            auditorias = auditoriaRepository.findAll().stream()
                    .filter(a -> a.getAccion().equals(accion) && a.getTablaAfectada().equals(tabla))
                    .sorted((a, b) -> b.getFechaHora().compareTo(a.getFechaHora()))
                    .collect(Collectors.toList());
        } else if (accion != null && !accion.isEmpty()) {
            auditorias = auditoriaRepository.findByAccionOrderByFechaHoraDesc(accion);
        } else if (tabla != null && !tabla.isEmpty()) {
            auditorias = auditoriaRepository.findByTablaAfectadaOrderByFechaHoraDesc(tabla);
        } else {
            auditorias = auditoriaRepository.findAll().stream()
                    .sorted((a, b) -> b.getFechaHora().compareTo(a.getFechaHora()))
                    .collect(Collectors.toList());
        }
        
        return auditorias.stream()
                .map(this::convertToAdminAuditoriaDTO)
                .collect(Collectors.toList());
    }
    
    // ========================
    // MÉTODOS AUXILIARES
    // ========================
    
    private AdminUsuarioDTO convertToAdminUsuarioDTO(Usuario usuario) {
        AdminUsuarioDTO dto = new AdminUsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setRut(usuario.getRut());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setRol(usuario.getRol().getNombre());
        dto.setEstado(usuario.getEstado());
        dto.setRegion(usuario.getRegion());
        dto.setComuna(usuario.getComuna());
        dto.setCorreoValidado(usuario.getCorreoValidado());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        return dto;
    }
    
    private AdminPrestadorValidacionDTO convertToAdminPrestadorValidacionDTO(Prestador prestador) {
        AdminPrestadorValidacionDTO dto = new AdminPrestadorValidacionDTO();
        dto.setIdPrestador(prestador.getIdPrestador());
        dto.setIdUsuario(prestador.getUsuario().getIdUsuario());
        dto.setNombrePrestador(prestador.getUsuario().getNombre() + " " + prestador.getUsuario().getApellido());
        dto.setEmail(prestador.getUsuario().getCorreo());
        dto.setTelefono(prestador.getUsuario().getTelefono());
        
        // Obtener especialidad del primer servicio del prestador
        List<Servicio> servicios = servicioRepository.findByPrestador(prestador);
        String especialidad = (servicios != null && !servicios.isEmpty()) 
            ? servicios.get(0).getEspecialidad().getNombre() 
            : "N/A";
        dto.setEspecialidad(especialidad);
        
        dto.setCategoria(prestador.getCategoriaPrestador() != null ? prestador.getCategoriaPrestador().getNombre() : "N/A");
        dto.setTipoPrestador(prestador.getTipoPrestador());
        dto.setDescripcion(prestador.getDescripcion());
        dto.setExperiencia(prestador.getExperiencia());
        dto.setEstadoValidacion(prestador.getEstadoValidacion());
        dto.setEmpresa(prestador.getEmpresa() != null ? prestador.getEmpresa().getNombreComercial() : null);
        
        List<Certificacion> certificaciones = certificacionRepository.findByPrestador(prestador);
        dto.setCertificacionesCount(certificaciones.size());
        
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
        
        // Obtener nombre del admin
        Optional<Usuario> admin = usuarioRepository.findById(auditoria.getIdAdmin());
        if (admin.isPresent()) {
            dto.setNombreAdmin(admin.get().getNombre());
        }
        
        return dto;
    }
    
    private void registrarAuditoria(Long idAdmin, String accion, String tabla, Long registroId,
                                   String valorAnterior, String valorNuevo, String detalles) {
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
    
    // Método para listar todos los usuarios 
    public List<AdminUsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertToAdminUsuarioDTO)
                .collect(Collectors.toList());
    }
}