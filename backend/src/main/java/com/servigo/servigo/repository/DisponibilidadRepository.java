package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {

    List<Disponibilidad> findByPrestadorIdPrestador(Long idPrestador);

    List<Disponibilidad> findByPrestadorIdPrestadorAndServicioIdServicio(Long idPrestador, Long idServicio);

    List<Disponibilidad> findByServicioIdServicio(Long idServicio);

    boolean existsByPrestadorIdPrestadorAndFechaAndExcluido(Long idPrestador, LocalDate fecha, Boolean excluido);
}