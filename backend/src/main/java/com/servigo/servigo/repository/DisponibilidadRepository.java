package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {

    List<Disponibilidad> findByPrestadorIdPrestador(Long idPrestador);
}