package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.entity.Especialidad;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Reserva;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.repository.DisponibilidadRepository;
import com.servigo.servigo.repository.EspecialidadRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ResenaRepository;
import com.servigo.servigo.repository.ReservaRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;
import com.servigo.servigo.repository.ValidacionBiometricaRepository;
import com.servigo.servigo.dto.ServicioDTO;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final PrestadorRepository prestadorRepository;
    private final EspecialidadRepository especialidadRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final SolicitudServicioRepository solicitudServicioRepository;
    private final ReservaRepository reservaRepository;
    private final ResenaRepository resenaRepository;
    private final ValidacionBiometricaRepository validacionBiometricaRepository;

    public ServicioService(ServicioRepository servicioRepository,
                           PrestadorRepository prestadorRepository,
                           EspecialidadRepository especialidadRepository,
                           DisponibilidadRepository disponibilidadRepository,
                           SolicitudServicioRepository solicitudServicioRepository,
                           ReservaRepository reservaRepository,
                           ResenaRepository resenaRepository,
                           ValidacionBiometricaRepository validacionBiometricaRepository) {
        this.servicioRepository = servicioRepository;
        this.prestadorRepository = prestadorRepository;
        this.especialidadRepository = especialidadRepository;
        this.disponibilidadRepository = disponibilidadRepository;
        this.solicitudServicioRepository = solicitudServicioRepository;
        this.reservaRepository = reservaRepository;
        this.resenaRepository = resenaRepository;
        this.validacionBiometricaRepository = validacionBiometricaRepository;
    }

    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    public Servicio crearServicio(ServicioDTO dto) {

        Prestador prestador = prestadorRepository
                .findById(dto.getIdPrestador())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        Especialidad especialidad = especialidadRepository
                .findById(dto.getIdEspecialidad())
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        Servicio servicio = new Servicio();

        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecioReferencial(dto.getPrecioReferencial());
        servicio.setModalidad(dto.getModalidad());
        servicio.setEstado("activo");
        servicio.setPrestador(prestador);
        servicio.setEspecialidad(especialidad);

        return servicioRepository.save(servicio);
    }

    public Servicio actualizarServicio(Long id, Servicio servicioActualizado) {

        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        servicio.setNombre(servicioActualizado.getNombre());
        servicio.setDescripcion(servicioActualizado.getDescripcion());
        servicio.setPrecioReferencial(servicioActualizado.getPrecioReferencial());
        servicio.setModalidad(servicioActualizado.getModalidad());
        servicio.setEstado(servicioActualizado.getEstado());

        if (servicioActualizado.getPrestador() != null &&
            servicioActualizado.getPrestador().getIdPrestador() != null) {

            Prestador prestador = prestadorRepository
                    .findById(servicioActualizado.getPrestador().getIdPrestador())
                    .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

            servicio.setPrestador(prestador);
        }

        if (servicioActualizado.getEspecialidad() != null &&
            servicioActualizado.getEspecialidad().getIdEspecialidad() != null) {

            Especialidad especialidad = especialidadRepository
                    .findById(servicioActualizado.getEspecialidad().getIdEspecialidad())
                    .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

            servicio.setEspecialidad(especialidad);
        }

        return servicioRepository.save(servicio);
    }

    @Transactional
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado");
        }

        List<SolicitudServicio> solicitudes = solicitudServicioRepository.findByServicioIdServicio(id);

        for (SolicitudServicio solicitud : solicitudes) {
            Reserva reserva = reservaRepository.findBySolicitud_IdSolicitud(solicitud.getIdSolicitud()).orElse(null);
            if (reserva != null) {
                resenaRepository.deleteByReserva_IdReserva(reserva.getIdReserva());
                reservaRepository.delete(reserva);
            }
            validacionBiometricaRepository.deleteBySolicitud_IdSolicitud(solicitud.getIdSolicitud());
        }

        solicitudServicioRepository.deleteAll(solicitudes);

        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByServicioIdServicio(id);
        disponibilidadRepository.deleteAll(disponibilidades);

        servicioRepository.deleteById(id);
    }
}
