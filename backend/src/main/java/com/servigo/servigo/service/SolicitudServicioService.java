package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;

@Service
public class SolicitudServicioService {

    private final SolicitudServicioRepository solicitudRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    public SolicitudServicioService(SolicitudServicioRepository solicitudRepository,
                                    ClienteRepository clienteRepository,
                                    ServicioRepository servicioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
    }

    public List<SolicitudServicio> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    public SolicitudServicio obtenerSolicitudPorId(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public SolicitudServicio crearSolicitud(SolicitudServicio solicitud) {

        // 🔥 Validar cliente
        if (solicitud.getCliente() == null || solicitud.getCliente().getIdCliente() == null) {
            throw new RuntimeException("Debe enviar idCliente");
        }

        // 🔥 Validar servicio
        if (solicitud.getServicio() == null || solicitud.getServicio().getIdServicio() == null) {
            throw new RuntimeException("Debe enviar idServicio");
        }

        Cliente cliente = clienteRepository
                .findById(solicitud.getCliente().getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Servicio servicio = servicioRepository
                .findById(solicitud.getServicio().getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        solicitud.setCliente(cliente);
        solicitud.setServicio(servicio);

        return solicitudRepository.save(solicitud);
    }

    public SolicitudServicio actualizarSolicitud(Long id, SolicitudServicio solicitudActualizada) {

        SolicitudServicio solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setFechaHoraSolicitud(solicitudActualizada.getFechaHoraSolicitud());
        solicitud.setFechaHoraPreferida(solicitudActualizada.getFechaHoraPreferida());
        solicitud.setDireccionAtencion(solicitudActualizada.getDireccionAtencion());
        solicitud.setEstado(solicitudActualizada.getEstado());
        solicitud.setObservacion(solicitudActualizada.getObservacion());

        return solicitudRepository.save(solicitud);
    }

    public void eliminarSolicitud(Long id) {
        if (!solicitudRepository.existsById(id)) {
            throw new RuntimeException("Solicitud no encontrada");
        }
        solicitudRepository.deleteById(id);
    }
}