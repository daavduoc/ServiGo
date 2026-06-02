package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.repository.DisponibilidadRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ServicioRepository;

@Service
public class DisponibilidadService {

    private final DisponibilidadRepository disponibilidadRepository;
    private final PrestadorRepository prestadorRepository;
    private final ServicioRepository servicioRepository;

    public DisponibilidadService(DisponibilidadRepository disponibilidadRepository,
                                 PrestadorRepository prestadorRepository,
                                 ServicioRepository servicioRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
        this.prestadorRepository = prestadorRepository;
        this.servicioRepository = servicioRepository;
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

        //  VALIDACIÓN
        if (disponibilidad.getPrestador() == null ||
            disponibilidad.getPrestador().getIdPrestador() == null) {
            throw new RuntimeException("Debe enviar idPrestador");
        }

        //  BUSCAR prestador real en BD
        Prestador prestador = prestadorRepository
                .findById(disponibilidad.getPrestador().getIdPrestador())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        disponibilidad.setPrestador(prestador);

        //  RESOLVER servicio si viene
        if (disponibilidad.getServicio() != null &&
            disponibilidad.getServicio().getIdServicio() != null) {

            Servicio servicio = servicioRepository
                    .findById(disponibilidad.getServicio().getIdServicio())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

            disponibilidad.setServicio(servicio);
        }

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

        //  VALIDAR servicio opcional
        if (disponibilidadActualizada.getServicio() != null &&
            disponibilidadActualizada.getServicio().getIdServicio() != null) {

            Servicio servicio = servicioRepository
                    .findById(disponibilidadActualizada.getServicio().getIdServicio())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

            disponibilidad.setServicio(servicio);
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



    public List<Disponibilidad> crearDisponibilidades(List<Disponibilidad> disponibilidades) {

    for (Disponibilidad disponibilidad : disponibilidades) {

        if (disponibilidad.getPrestador() == null ||
            disponibilidad.getPrestador().getIdPrestador() == null) {
            throw new RuntimeException("Debe enviar idPrestador");
        }

        Prestador prestador = prestadorRepository
                .findById(disponibilidad.getPrestador().getIdPrestador())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        disponibilidad.setPrestador(prestador);

        //  RESOLVER servicio si viene
        if (disponibilidad.getServicio() != null &&
            disponibilidad.getServicio().getIdServicio() != null) {

            Servicio servicio = servicioRepository
                    .findById(disponibilidad.getServicio().getIdServicio())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

            disponibilidad.setServicio(servicio);
        }

        if (disponibilidad.getEstado() == null || disponibilidad.getEstado().isBlank()) {
            disponibilidad.setEstado("activo");
        }
    }

    return disponibilidadRepository.saveAll(disponibilidades);
    }
}
