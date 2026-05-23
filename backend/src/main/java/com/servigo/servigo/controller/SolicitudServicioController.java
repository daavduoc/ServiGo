package com.servigo.servigo.controller;

import com.servigo.servigo.dto.PrestadorTrabajoDTO;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.service.SolicitudServicioService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/prestador/mis-trabajos")
    public List<PrestadorTrabajoDTO> misTrabajosPrestador(Authentication authentication) {
        return solicitudService.listarTrabajosPrestadorAutenticado(authentication.getName());
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