package com.servigo.servigo.service;

import com.servigo.servigo.dto.BloqueoDisponibilidadDTO;
import com.servigo.servigo.entity.BloqueoDisponibilidad;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.repository.BloqueoDisponibilidadRepository;
import com.servigo.servigo.repository.ServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloqueoDisponibilidadService {

    private final BloqueoDisponibilidadRepository bloqueoRepository;
    private final ServicioRepository servicioRepository;

    public BloqueoDisponibilidadService(
            BloqueoDisponibilidadRepository bloqueoRepository,
            ServicioRepository servicioRepository
    ) {
        this.bloqueoRepository = bloqueoRepository;
        this.servicioRepository = servicioRepository;
    }

    public List<BloqueoDisponibilidadDTO> listarPorServicio(Long idServicio) {
        return bloqueoRepository.findByServicio_IdServicio(idServicio)
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    public BloqueoDisponibilidadDTO crear(Long idServicio, BloqueoDisponibilidad bloqueo) {
        Servicio servicio = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        bloqueo.setServicio(servicio);
        validarBloqueo(bloqueo);

        BloqueoDisponibilidad guardado = bloqueoRepository.save(bloqueo);
        return convertirDTO(guardado);
    }

    public BloqueoDisponibilidadDTO actualizar(Long idBloqueo, BloqueoDisponibilidad datos) {
        BloqueoDisponibilidad bloqueo = bloqueoRepository.findById(idBloqueo)
                .orElseThrow(() -> new RuntimeException("Bloqueo no encontrado"));

        bloqueo.setFecha(datos.getFecha());
        bloqueo.setHoraInicio(datos.getHoraInicio());
        bloqueo.setHoraFin(datos.getHoraFin());
        bloqueo.setTipo(datos.getTipo());
        bloqueo.setMotivo(datos.getMotivo());

        validarBloqueo(bloqueo);

        BloqueoDisponibilidad actualizado = bloqueoRepository.save(bloqueo);
        return convertirDTO(actualizado);
    }

    public void eliminar(Long idBloqueo) {
        if (!bloqueoRepository.existsById(idBloqueo)) {
            throw new RuntimeException("Bloqueo no encontrado");
        }

        bloqueoRepository.deleteById(idBloqueo);
    }

    private void validarBloqueo(BloqueoDisponibilidad bloqueo) {
        if (bloqueo.getFecha() == null) {
            throw new RuntimeException("La fecha es obligatoria");
        }

        if (bloqueo.getTipo() == null) {
            throw new RuntimeException("El tipo es obligatorio");
        }

        if (!bloqueo.getTipo().equals("DIA_COMPLETO") &&
            !bloqueo.getTipo().equals("INTERVALO")) {
            throw new RuntimeException("Tipo de bloqueo inválido");
        }

        if (bloqueo.getTipo().equals("DIA_COMPLETO")) {
            bloqueo.setHoraInicio(null);
            bloqueo.setHoraFin(null);
        }

        if (bloqueo.getTipo().equals("INTERVALO")) {
            if (bloqueo.getHoraInicio() == null || bloqueo.getHoraFin() == null) {
                throw new RuntimeException("Debe ingresar hora inicio y hora fin");
            }

            if (!bloqueo.getHoraFin().isAfter(bloqueo.getHoraInicio())) {
                throw new RuntimeException("La hora fin debe ser mayor que la hora inicio");
            }
        }
    }

    private BloqueoDisponibilidadDTO convertirDTO(BloqueoDisponibilidad bloqueo) {
        BloqueoDisponibilidadDTO dto = new BloqueoDisponibilidadDTO();

        dto.setIdBloqueo(bloqueo.getIdBloqueo());
        dto.setIdServicio(bloqueo.getServicio().getIdServicio());
        dto.setFecha(bloqueo.getFecha());
        dto.setHoraInicio(bloqueo.getHoraInicio());
        dto.setHoraFin(bloqueo.getHoraFin());
        dto.setTipo(bloqueo.getTipo());
        dto.setMotivo(bloqueo.getMotivo());

        return dto;
    }
}