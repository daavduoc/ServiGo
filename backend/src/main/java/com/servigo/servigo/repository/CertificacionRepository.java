package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Certificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificacionRepository extends JpaRepository<Certificacion, Long> {

    List<Certificacion> findByPrestadorIdPrestador(Long idPrestador);

    long countByPrestadorIdPrestador(Long idPrestador);
}