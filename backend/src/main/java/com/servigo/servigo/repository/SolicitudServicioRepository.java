package com.servigo.servigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.servigo.servigo.entity.SolicitudServicio;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByEstado(String estado);
    long countByEstado(String estado);
    List<SolicitudServicio> findByFechaHoraSolicitudBetween(LocalDateTime inicio, LocalDateTime fin);
}