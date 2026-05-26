package com.servigo.servigo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servigo.servigo.dto.AceptarSolicitudPrestadorDTO;
import com.servigo.servigo.dto.PrestadorTrabajoDTO;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.service.SolicitudServicioService;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudServicioController {

    private final SolicitudServicioService solicitudService;

    public SolicitudServicioController(SolicitudServicioService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping
    public List<SolicitudServicio> listarSolicitudes() {
        return solicitudService.listarSolicitudes();
    }

    @GetMapping("/prestador/nuevas")
    public ResponseEntity<?> nuevasSolicitudesPrestador(Authentication authentication) {
        try {
            List<PrestadorTrabajoDTO> data = solicitudService.listarSolicitudesPendientesPrestador(
                    authentication.getName()
            );
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/prestador/mis-trabajos")
    public ResponseEntity<?> misTrabajosPrestador(Authentication authentication) {
        try {
            List<PrestadorTrabajoDTO> data = solicitudService.listarTrabajosPrestadorAutenticado(
                    authentication.getName()
            );
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/prestador/{id}/aceptar")
    public ResponseEntity<?> aceptarSolicitudPrestador(
            @PathVariable Long id,
            @RequestBody(required = false) AceptarSolicitudPrestadorDTO dto,
            Authentication authentication
    ) {
        try {
            PrestadorTrabajoDTO trabajo = solicitudService.aceptarSolicitudPrestador(
                    id, authentication.getName(), dto != null ? dto : new AceptarSolicitudPrestadorDTO()
            );
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Solicitud confirmada correctamente",
                    "trabajo", trabajo
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/prestador/{id}/rechazar")
    public ResponseEntity<?> rechazarSolicitudPrestador(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            solicitudService.rechazarSolicitudPrestador(id, authentication.getName());
            return ResponseEntity.ok(Map.of("mensaje", "Solicitud rechazada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public SolicitudServicio obtenerSolicitud(@PathVariable Long id) {
        return solicitudService.obtenerSolicitudPorId(id);
    }

    @PostMapping
    public SolicitudServicio crearSolicitud(@RequestBody SolicitudServicio solicitud) {
        return solicitudService.crearSolicitud(solicitud);
    }

    @PutMapping("/{id}")
    public SolicitudServicio actualizarSolicitud(@PathVariable Long id,
                                                 @RequestBody SolicitudServicio solicitudActualizada) {
        return solicitudService.actualizarSolicitud(id, solicitudActualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarSolicitud(@PathVariable Long id) {
        solicitudService.eliminarSolicitud(id);
    }
}
