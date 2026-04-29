package com.servigo.servigo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Reserva;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.repository.ReservaRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final SolicitudServicioRepository solicitudRepository;

    public ReservaService(ReservaRepository reservaRepository,
                          SolicitudServicioRepository solicitudRepository) {
        this.reservaRepository = reservaRepository;
        this.solicitudRepository = solicitudRepository;
    }

    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    public Reserva obtenerReservaPorId(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public Reserva crearReserva(Reserva reserva) {

        if (reserva.getSolicitud() == null || reserva.getSolicitud().getIdSolicitud() == null) {
            throw new RuntimeException("Debe enviar idSolicitud");
        }

        SolicitudServicio solicitud = solicitudRepository
                .findById(reserva.getSolicitud().getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        reserva.setSolicitud(solicitud);

        if (reserva.getFechaCreacionReserva() == null) {
            reserva.setFechaCreacionReserva(LocalDateTime.now());
        }

        return reservaRepository.save(reserva);
    }

    public Reserva actualizarReserva(Long id, Reserva reservaActualizada) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setFechaHoraReserva(reservaActualizada.getFechaHoraReserva());
        reserva.setEstado(reservaActualizada.getEstado());

        return reservaRepository.save(reserva);
    }

    public void eliminarReserva(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new RuntimeException("Reserva no encontrada");
        }
        reservaRepository.deleteById(id);
    }
}