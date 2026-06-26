package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByRutEmpresa(String rutEmpresa);
}