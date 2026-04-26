package com.servigo.servigo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.servigo.servigo.entity.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
}