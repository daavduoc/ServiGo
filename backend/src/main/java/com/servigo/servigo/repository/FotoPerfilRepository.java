package com.servigo.servigo.repository;

import com.servigo.servigo.entity.FotoPerfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FotoPerfilRepository extends JpaRepository<FotoPerfil, Long> {

    Optional<FotoPerfil> findByUsuario_IdUsuario(Long idUsuario);
}