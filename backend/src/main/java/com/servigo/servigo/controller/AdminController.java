package com.servigo.servigo.controller;

import com.servigo.servigo.dto.AdminDashboardStatsDTO;
import com.servigo.servigo.dto.AdminPrestadorValidacionDTO;
import com.servigo.servigo.dto.AdminAuditoriaDTO;
import com.servigo.servigo.dto.AdminUsuarioDTO;
import com.servigo.servigo.dto.AdminMensajeSoporteDTO;
import com.servigo.servigo.entity.Certificacion;
import com.servigo.servigo.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ========================
    // 1. DASHBOARD (ÚNICO DEL ADMIN)
    // ========================

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsDTO> obtenerDashboard(Authentication authentication) {
        log.info("Admin {} accedió al dashboard", authentication.getName());
        try {
            AdminDashboardStatsDTO stats = adminService.obtenerEstadisticasDashboard();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error al obtener estadísticas del dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // 2-4. CONTROL DE USUARIOS (ESPECÍFICO ADMIN)
    // ========================

    @GetMapping("/usuarios")
    public ResponseEntity<List<AdminUsuarioDTO>> listarUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String estado,
            Authentication authentication) {
        log.info("Admin {} consultó listado de usuarios - rol: {}, estado: {}", 
                 authentication.getName(), rol, estado);
        try {
            List<AdminUsuarioDTO> usuarios = adminService.listarUsuariosCompleto(page, size, rol, estado);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            log.error("Error al listar usuarios", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/control-usuarios/{id}/bloquear")
    public ResponseEntity<?> bloquearUsuario(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        log.info("Admin {} bloqueó usuario {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            String motivo = request.getOrDefault("motivo", "Sin especificar");
            adminService.bloquearUsuario(id, motivo, idAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuario bloqueado exitosamente",
                "usuarioId", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al bloquear usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al bloquear usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/control-usuarios/{id}/desbloquear")
    public ResponseEntity<?> desbloquearUsuario(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} desbloqueó usuario {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            adminService.desbloquearUsuario(id, idAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuario desbloqueado exitosamente",
                "usuarioId", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al desbloquear usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al desbloquear usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/control-usuarios/{id}/desactivar")
    public ResponseEntity<?> desactivarUsuario(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        log.info("Admin {} desactivó usuario {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            String motivo = request.getOrDefault("motivo", "Sin especificar");
            adminService.desactivarUsuario(id, motivo, idAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuario desactivado exitosamente",
                "usuarioId", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al desactivar usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al desactivar usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // 5-6. VALIDACIÓN DE PRESTADORES (ESPECÍFICO ADMIN)
    // ========================

    @GetMapping("/validacion/prestadores")
    public ResponseEntity<List<AdminPrestadorValidacionDTO>> listarPrestadoresValidacion(
            Authentication authentication) {
        log.info("Admin {} consultó prestadores pendientes de validación", authentication.getName());
        try {
            List<AdminPrestadorValidacionDTO> prestadores = adminService.listarPrestadoresValidacion();
            return ResponseEntity.ok(prestadores);
        } catch (Exception e) {
            log.error("Error al listar prestadores pendientes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/validacion/prestadores/{id}")
    public ResponseEntity<AdminPrestadorValidacionDTO> obtenerPrestadorValidacion(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} consultó prestador para validación {}", authentication.getName(), id);
        try {
            AdminPrestadorValidacionDTO prestador = adminService.obtenerPrestadorCompleto(id);
            return ResponseEntity.ok(prestador);
        } catch (RuntimeException e) {
            log.warn("Prestador no encontrado: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error al obtener prestador", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/validacion/prestadores/{id}/certificaciones")
    public ResponseEntity<List<Certificacion>> obtenerCertificacionesPrestador(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} consultó certificaciones del prestador {}", authentication.getName(), id);
        try {
            List<Certificacion> certificaciones = adminService.obtenerCertificacionesPrestador(id);
            return ResponseEntity.ok(certificaciones);
        } catch (RuntimeException e) {
            log.warn("Prestador no encontrado: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error al obtener certificaciones", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/validacion/prestadores/{id}/aprobar")
    public ResponseEntity<?> aprobarPrestador(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} aprobó prestador {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            adminService.aprobarPrestador(id, idAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Prestador aprobado exitosamente",
                "prestadorId", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al aprobar prestador: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al aprobar prestador", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/validacion/prestadores/{id}/rechazar")
    public ResponseEntity<?> rechazarPrestador(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        log.info("Admin {} rechazó prestador {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            String motivo = request.getOrDefault("motivo", "Sin especificar");
            adminService.rechazarPrestador(id, motivo, idAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Prestador rechazado exitosamente",
                "prestadorId", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al rechazar prestador: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al rechazar prestador", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // 7. REPORTES (ESPECÍFICO ADMIN)
    // ========================

    @GetMapping("/reportes/periodo")
    public ResponseEntity<?> generarReportePeriodo(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin,
            Authentication authentication) {
        log.info("Admin {} generó reporte - fechaInicio: {}, fechaFin: {}", 
                 authentication.getName(), fechaInicio, fechaFin);
        try {
            LocalDateTime inicio = LocalDateTime.parse(fechaInicio);
            LocalDateTime fin = LocalDateTime.parse(fechaFin);
            
            return ResponseEntity.ok(adminService.generarReportePeriodo(inicio, fin));
        } catch (IllegalArgumentException e) {
            log.warn("Formato de fecha inválido: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Formato de fecha inválido. Use: yyyy-MM-dd'T'HH:mm:ss"));
        } catch (Exception e) {
            log.error("Error al generar reporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // 8. AUDITORÍA (ESPECÍFICO ADMIN)
    // ========================

    @GetMapping("/auditoria")
    public ResponseEntity<List<AdminAuditoriaDTO>> obtenerAuditoria(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) String tabla,
            Authentication authentication) {
        log.info("Admin {} consultó auditoría - accion: {}, tabla: {}", authentication.getName(), accion, tabla);
        try {
            List<AdminAuditoriaDTO> auditoria = adminService.obtenerHistorialAuditoria(page, size, accion, tabla);
            return ResponseEntity.ok(auditoria);
        } catch (Exception e) {
            log.error("Error al obtener auditoría", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // SOPORTE / MENSAJES (ADMIN)
    // ========================

    @GetMapping("/soporte/mensajes")
    public ResponseEntity<?> listarMensajesSoporte(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String rol,
            Authentication authentication) {
        log.info("Admin {} consultó mensajes de soporte - estado: {}, rol: {}",
                 authentication.getName(), estado, rol);
        try {
            List<AdminMensajeSoporteDTO> mensajes = adminService.listarMensajesSoporte(estado, rol);
            return ResponseEntity.ok(mensajes);
        } catch (Exception e) {
            log.error("Error al listar mensajes de soporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/soporte/mensajes/{id}/estado")
    public ResponseEntity<?> actualizarEstadoMensaje(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        log.info("Admin {} actualizó estado del mensaje {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            String nuevoEstado = request.getOrDefault("estado", "en_proceso");
            adminService.actualizarEstadoMensaje(id, nuevoEstado, idAdmin);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Estado actualizado exitosamente",
                    "idMensaje", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al actualizar estado del mensaje: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al actualizar estado del mensaje", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/soporte/mensajes/{id}/respuesta")
    public ResponseEntity<?> responderMensaje(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        log.info("Admin {} respondió mensaje {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            String respuesta = request.getOrDefault("respuesta", "");
            if (respuesta.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La respuesta no puede estar vacía"));
            }
            adminService.responderMensajeSoporte(id, respuesta, idAdmin);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Respuesta enviada exitosamente",
                    "idMensaje", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al responder mensaje: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al responder mensaje de soporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/soporte/mensajes/{id}")
    public ResponseEntity<?> eliminarMensaje(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Admin {} eliminó mensaje de soporte {}", authentication.getName(), id);
        try {
            Long idAdmin = obtenerIdAdminDelToken(authentication);
            adminService.eliminarMensajeSoporte(id, idAdmin);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Mensaje eliminado exitosamente",
                    "idMensaje", id.toString()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al eliminar mensaje: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al eliminar mensaje de soporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // MÉTODOS AUXILIARES
    // ========================

    private Long obtenerIdAdminDelToken(Authentication authentication) {
        try {
            String principal = authentication.getName();
            try {
                return Long.parseLong(principal);
            } catch (NumberFormatException e) {
                return 1L;
            }
        } catch (Exception e) {
            log.error("Error al extraer ID del admin del token", e);
            throw new RuntimeException("No se pudo identificar al admin");
        }
    }
}