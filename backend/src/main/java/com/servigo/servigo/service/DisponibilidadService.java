package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.repository.DisponibilidadRepository;

@Service
public class DisponibilidadService {

    private final DisponibilidadRepository disponibilidadRepository;

    public DisponibilidadService(DisponibilidadRepository disponibilidadRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
    }

    public List<Disponibilidad> listarDisponibilidades() {
        return disponibilidadRepository.findAll();
    }

    public Disponibilidad obtenerDisponibilidadPorId(Long id) {
        return disponibilidadRepository.findById(id).orElse(null);
    }

    public Disponibilidad crearDisponibilidad(Disponibilidad disponibilidad) {
        return disponibilidadRepository.save(disponibilidad);
    }

    public Disponibilidad actualizarDisponibilidad(Long id, Disponibilidad disponibilidadActualizada) {
        Disponibilidad disponibilidad = disponibilidadRepository.findById(id).orElse(null);
        
        if (disponibilidad != null && disponibilidadActualizada != null) {
            disponibilidad.setDiaSemana(disponibilidadActualizada.getDiaSemana());
            disponibilidad.setHoraInicio(disponibilidadActualizada.getHoraInicio());
            disponibilidad.setHoraFin(disponibilidadActualizada.getHoraFin());
            disponibilidad.setEstado(disponibilidadActualizada.getEstado());
            return disponibilidadRepository.save(disponibilidad);
        }
        
        return null;
    }

    public void eliminarDisponibilidad(Long id) {
        disponibilidadRepository.deleteById(id);
    }
}