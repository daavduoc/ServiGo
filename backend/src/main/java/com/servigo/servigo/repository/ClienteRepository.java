package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByUsuario_IdUsuario(Long idUsuario);
}