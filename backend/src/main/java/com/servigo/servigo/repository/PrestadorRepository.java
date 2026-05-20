package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrestadorRepository extends JpaRepository<Prestador, Long> {

    Optional<Prestador> findByUsuario_IdUsuario(Long idUsuario);

    List<Prestador> findByEstadoValidacion(String estadoValidacion);

    long countByEstadoValidacion(String estadoValidacion);

    List<Prestador> findByCategoriaPrestadorNombreIgnoreCase(String nombre);
}