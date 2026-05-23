package com.servigo.servigo.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.servigo.servigo.dto.PrestadorTrabajoDTO;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.SolicitudServicioRepository;
import com.servigo.servigo.repository.UsuarioRepository;

@Service
public class SolicitudServicioService {

    private final SolicitudServicioRepository solicitudRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;
    private final PrestadorRepository prestadorRepository;
    private final UsuarioRepository usuarioRepository;

    private static final DateTimeFormatter FECHA_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public SolicitudServicioService(SolicitudServicioRepository solicitudRepository,
                                    ClienteRepository clienteRepository,
                                    ServicioRepository servicioRepository,
                                    PrestadorRepository prestadorRepository,
                                    UsuarioRepository usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
        this.prestadorRepository = prestadorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<SolicitudServicio> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    public List<PrestadorTrabajoDTO> listarTrabajosPrestadorAutenticado(String correo) {
        Prestador prestador = usuarioRepository
                .findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(
                        UsuarioRepository.normalizarCorreo(correo))
                .flatMap(usuario -> prestadorRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()))
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        return solicitudRepository
                .findByServicio_Prestador_IdPrestadorOrderByFechaHoraPreferidaDesc(prestador.getIdPrestador())
                .stream()
                .map(this::mapearTrabajo)
                .collect(Collectors.toList());
    }

    private PrestadorTrabajoDTO mapearTrabajo(SolicitudServicio solicitud) {
        PrestadorTrabajoDTO dto = new PrestadorTrabajoDTO();
        dto.setIdSolicitud(solicitud.getIdSolicitud());
        dto.setEstado(solicitud.getEstado());
        dto.setDireccionAtencion(solicitud.getDireccionAtencion());

        if (solicitud.getFechaHoraPreferida() != null) {
            dto.setFechaPreferida(solicitud.getFechaHoraPreferida().format(FECHA_FMT));
        }

        if (solicitud.getServicio() != null) {
            dto.setServicioNombre(solicitud.getServicio().getNombre());
            dto.setDescripcion(solicitud.getServicio().getDescripcion());
        }

        if (solicitud.getCliente() != null && solicitud.getCliente().getUsuario() != null) {
            var usuario = solicitud.getCliente().getUsuario();
            String nombre = usuario.getNombre() != null ? usuario.getNombre() : "";
            String apellido = usuario.getApellido() != null ? usuario.getApellido() : "";
            dto.setClienteNombre((nombre + " " + apellido).trim());
        }

        return dto;
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