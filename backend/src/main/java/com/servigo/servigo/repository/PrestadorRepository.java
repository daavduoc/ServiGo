package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PrestadorRepository extends JpaRepository<Prestador, Long> {

    Optional<Prestador> findByUsuario_IdUsuario(Long idUsuario);
}