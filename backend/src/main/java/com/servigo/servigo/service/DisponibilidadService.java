package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.repository.DisponibilidadRepository;
import com.servigo.servigo.repository.PrestadorRepository;

@Service
public class DisponibilidadService {

    private final DisponibilidadRepository disponibilidadRepository;
    private final PrestadorRepository prestadorRepository;

    public DisponibilidadService(DisponibilidadRepository disponibilidadRepository,
                                 PrestadorRepository prestadorRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
        this.prestadorRepository = prestadorRepository;
    }

    // GET: listar todo
    public List<Disponibilidad> listarDisponibilidades() {
        return disponibilidadRepository.findAll();
    }

    // GET: por ID
    public Disponibilidad obtenerDisponibilidadPorId(Long id) {
        return disponibilidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));
    }

    // POST: crear
    public Disponibilidad crearDisponibilidad(Disponibilidad disponibilidad) {

        // 🔥 VALIDACIÓN
        if (disponibilidad.getPrestador() == null ||
            disponibilidad.getPrestador().getIdPrestador() == null) {
            throw new RuntimeException("Debe enviar idPrestador");
        }

        // 🔥 BUSCAR prestador real en BD
        Prestador prestador = prestadorRepository
                .findById(disponibilidad.getPrestador().getIdPrestador())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        disponibilidad.setPrestador(prestador);

        return disponibilidadRepository.save(disponibilidad);
    }

    // PUT: actualizar
    public Disponibilidad actualizarDisponibilidad(Long id, Disponibilidad disponibilidadActualizada) {

        Disponibilidad disponibilidad = disponibilidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));

        disponibilidad.setDiaSemana(disponibilidadActualizada.getDiaSemana());
        disponibilidad.setHoraInicio(disponibilidadActualizada.getHoraInicio());
        disponibilidad.setHoraFin(disponibilidadActualizada.getHoraFin());
        disponibilidad.setEstado(disponibilidadActualizada.getEstado());

        //  VALIDAR prestador opcional
        if (disponibilidadActualizada.getPrestador() != null &&
            disponibilidadActualizada.getPrestador().getIdPrestador() != null) {

            Prestador prestador = prestadorRepository
                    .findById(disponibilidadActualizada.getPrestador().getIdPrestador())
                    .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

            disponibilidad.setPrestador(prestador);
        }

        return disponibilidadRepository.save(disponibilidad);
    }

    // DELETE
    public void eliminarDisponibilidad(Long id) {
        if (!disponibilidadRepository.existsById(id)) {
            throw new RuntimeException("Disponibilidad no encontrada");
        }
        disponibilidadRepository.deleteById(id);
    }
}