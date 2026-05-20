package com.servigo.servigo.repository;

import com.servigo.servigo.entity.CategoriaPrestador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaPrestadorRepository extends JpaRepository<CategoriaPrestador, Long> {

    Optional<CategoriaPrestador> findByNombre(String nombre);
}