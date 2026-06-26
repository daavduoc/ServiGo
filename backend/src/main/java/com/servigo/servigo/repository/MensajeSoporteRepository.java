package com.servigo.servigo.repository;

import com.servigo.servigo.entity.MensajeSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeSoporteRepository extends JpaRepository<MensajeSoporte, Long> {

    List<MensajeSoporte> findAllByOrderByFechaCreacionDesc();

    List<MensajeSoporte> findByEstadoOrderByFechaCreacionDesc(String estado);

    List<MensajeSoporte> findByRolRemitenteOrderByFechaCreacionDesc(String rolRemitente);

    List<MensajeSoporte> findByEstadoAndRolRemitenteOrderByFechaCreacionDesc(String estado, String rolRemitente);

    List<MensajeSoporte> findByUsuario_IdUsuarioOrderByFechaCreacionDesc(Long idUsuario);

    long countByEstado(String estado);
}
