package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    List<Servicio> findByPrestadorIdPrestador(Long idPrestador);
}