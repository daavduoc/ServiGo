package com.servigo.servigo.controller;

import com.servigo.servigo.dto.BloqueoDisponibilidadDTO;
import com.servigo.servigo.entity.BloqueoDisponibilidad;
import com.servigo.servigo.service.BloqueoDisponibilidadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bloqueos-disponibilidad")
@CrossOrigin(origins = "*")
public class BloqueoDisponibilidadController {

    private final BloqueoDisponibilidadService bloqueoService;

    public BloqueoDisponibilidadController(BloqueoDisponibilidadService bloqueoService) {
        this.bloqueoService = bloqueoService;
    }

    @GetMapping("/servicio/{idServicio}")
    public List<BloqueoDisponibilidadDTO> listarPorServicio(@PathVariable Long idServicio) {
        return bloqueoService.listarPorServicio(idServicio);
    }

    @PostMapping("/servicio/{idServicio}")
    public BloqueoDisponibilidadDTO crear(
            @PathVariable Long idServicio,
            @RequestBody BloqueoDisponibilidad bloqueo
    ) {
        return bloqueoService.crear(idServicio, bloqueo);
    }

    @PutMapping("/{idBloqueo}")
    public BloqueoDisponibilidadDTO actualizar(
            @PathVariable Long idBloqueo,
            @RequestBody BloqueoDisponibilidad bloqueo
    ) {
        return bloqueoService.actualizar(idBloqueo, bloqueo);
    }

    @DeleteMapping("/{idBloqueo}")
    public void eliminar(@PathVariable Long idBloqueo) {
        bloqueoService.eliminar(idBloqueo);
    }
}