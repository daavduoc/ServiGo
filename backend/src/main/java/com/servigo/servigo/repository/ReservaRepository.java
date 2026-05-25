package com.servigo.servigo.repository;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.servigo.servigo.entity.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    long countByEstado(String estado);

    List<Reserva> findByFechaCreacionReservaBetween(LocalDateTime inicio, LocalDateTime fin);

    @EntityGraph(attributePaths = {
            "solicitud",
            "solicitud.cliente",
            "solicitud.cliente.usuario",
            "solicitud.servicio",
            "solicitud.servicio.prestador",
            "solicitud.servicio.prestador.usuario"
    })
    List<Reserva> findBySolicitud_Cliente_IdClienteOrderByFechaHoraReservaDesc(Long idCliente);
}