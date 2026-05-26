package com.servigo.servigo.service;

import com.servigo.servigo.dto.CrearMensajeSoporteDTO;
import com.servigo.servigo.entity.MensajeSoporte;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.MensajeSoporteRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MensajeSoporteService {

    private final MensajeSoporteRepository mensajeSoporteRepository;
    private final UsuarioRepository usuarioRepository;

    public MensajeSoporteService(
            MensajeSoporteRepository mensajeSoporteRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.mensajeSoporteRepository = mensajeSoporteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public MensajeSoporte crearMensaje(Long idUsuario, CrearMensajeSoporteDTO dto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MensajeSoporte mensaje = new MensajeSoporte();
        mensaje.setUsuario(usuario);
        mensaje.setRolRemitente(usuario.getRol() != null ? usuario.getRol().getNombre() : "SIN_ROL");
        mensaje.setTipoProblema(dto.getTipoProblema());
        mensaje.setAsunto(dto.getAsunto());
        mensaje.setDescripcion(dto.getDescripcion());
        mensaje.setEstado("pendiente");
        mensaje.setFechaCreacion(LocalDateTime.now());

        return mensajeSoporteRepository.save(mensaje);
    }

    public List<MensajeSoporte> listarMensajes(String estado, String rolRemitente) {
        if (estado != null && !estado.isEmpty() && rolRemitente != null && !rolRemitente.isEmpty()) {
            return mensajeSoporteRepository.findByEstadoAndRolRemitenteOrderByFechaCreacionDesc(estado, rolRemitente);
        } else if (estado != null && !estado.isEmpty()) {
            return mensajeSoporteRepository.findByEstadoOrderByFechaCreacionDesc(estado);
        } else if (rolRemitente != null && !rolRemitente.isEmpty()) {
            return mensajeSoporteRepository.findByRolRemitenteOrderByFechaCreacionDesc(rolRemitente);
        } else {
            return mensajeSoporteRepository.findAllByOrderByFechaCreacionDesc();
        }
    }

    public MensajeSoporte obtenerMensaje(Long idMensaje) {
        return mensajeSoporteRepository.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje de soporte no encontrado"));
    }

    public MensajeSoporte actualizarEstado(Long idMensaje, String nuevoEstado) {
        MensajeSoporte mensaje = obtenerMensaje(idMensaje);
        mensaje.setEstado(nuevoEstado);
        mensaje.setFechaActualizacion(LocalDateTime.now());
        return mensajeSoporteRepository.save(mensaje);
    }

    public MensajeSoporte responderMensaje(Long idMensaje, String respuesta) {
        MensajeSoporte mensaje = obtenerMensaje(idMensaje);
        mensaje.setRespuesta(respuesta);
        mensaje.setEstado("resuelto");
        mensaje.setFechaActualizacion(LocalDateTime.now());
        return mensajeSoporteRepository.save(mensaje);
    }

    public void eliminarMensaje(Long idMensaje) {
        MensajeSoporte mensaje = obtenerMensaje(idMensaje);
        mensajeSoporteRepository.delete(mensaje);
    }

    public List<MensajeSoporte> listarMensajesPorUsuario(Long idUsuario) {
        return mensajeSoporteRepository.findByUsuario_IdUsuarioOrderByFechaCreacionDesc(idUsuario);
    }
}
