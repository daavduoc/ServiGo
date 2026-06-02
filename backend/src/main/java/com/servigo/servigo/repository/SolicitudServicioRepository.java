package com.servigo.servigo.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.servigo.servigo.entity.SolicitudServicio;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {
    List<SolicitudServicio> findByEstado(String estado);
    long countByEstado(String estado);
    List<SolicitudServicio> findByFechaHoraSolicitudBetween(LocalDateTime inicio, LocalDateTime fin);

    @EntityGraph(attributePaths = {"cliente", "cliente.usuario", "servicio", "servicio.prestador"})
    List<SolicitudServicio> findByServicio_Prestador_IdPrestadorOrderByFechaHoraPreferidaDesc(Long idPrestador);

    @EntityGraph(attributePaths = {"cliente", "cliente.usuario", "servicio", "servicio.prestador"})
    List<SolicitudServicio> findByServicio_Prestador_IdPrestadorAndEstadoOrderByFechaHoraPreferidaDesc(
            Long idPrestador, String estado);

    @EntityGraph(attributePaths = {
            "servicio",
            "servicio.prestador",
            "servicio.prestador.usuario",
            "servicio.prestador.empresa",
            "cliente",
            "cliente.usuario"
    })
    Optional<SolicitudServicio> findWithRelacionesByIdSolicitud(Long idSolicitud);

    List<SolicitudServicio> findByServicioIdServicio(Long idServicio);
}