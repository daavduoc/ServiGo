package com.servigo.servigo.repository;

import com.servigo.servigo.entity.FotoBiometricaRegistro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FotoBiometricaRegistroRepository extends JpaRepository<FotoBiometricaRegistro, Long> {

    Optional<FotoBiometricaRegistro> findByUsuario_IdUsuario(Long idUsuario);

    boolean existsByUsuario_IdUsuario(Long idUsuario);
}
