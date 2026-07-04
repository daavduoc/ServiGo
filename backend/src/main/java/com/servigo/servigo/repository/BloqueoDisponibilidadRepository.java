package com.servigo.servigo.repository;

import com.servigo.servigo.entity.BloqueoDisponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BloqueoDisponibilidadRepository extends JpaRepository<BloqueoDisponibilidad, Long> {

    List<BloqueoDisponibilidad> findByServicio_IdServicio(Long idServicio);

    List<BloqueoDisponibilidad> findByServicio_IdServicioAndFecha(Long idServicio, LocalDate fecha);
}