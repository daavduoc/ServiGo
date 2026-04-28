package com.servigo.servigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.servigo.servigo.entity.SolicitudServicio;

public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
}