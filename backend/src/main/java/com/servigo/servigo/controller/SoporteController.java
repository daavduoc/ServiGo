package com.servigo.servigo.controller;

import com.servigo.servigo.dto.CrearMensajeSoporteDTO;
import com.servigo.servigo.entity.MensajeSoporte;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.service.MensajeSoporteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/soporte")
@Slf4j
public class SoporteController {

    private final MensajeSoporteService mensajeSoporteService;
    private final UsuarioRepository usuarioRepository;

    public SoporteController(
            MensajeSoporteService mensajeSoporteService,
            UsuarioRepository usuarioRepository
    ) {
        this.mensajeSoporteService = mensajeSoporteService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/mensajes")
    public ResponseEntity<?> crearMensaje(
            @RequestBody CrearMensajeSoporteDTO dto,
            Authentication authentication) {
        try {
            Long idUsuario = obtenerIdDelToken(authentication);
            MensajeSoporte mensaje = mensajeSoporteService.crearMensaje(idUsuario, dto);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Reporte enviado exitosamente",
                    "idMensaje", mensaje.getIdMensaje()
            ));
        } catch (RuntimeException e) {
            log.warn("Error al crear mensaje de soporte: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al crear mensaje de soporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @GetMapping("/mis-mensajes")
    public ResponseEntity<?> listarMisMensajes(Authentication authentication) {
        try {
            Long idUsuario = obtenerIdDelToken(authentication);
            return ResponseEntity.ok(mensajeSoporteService.listarMensajesPorUsuario(idUsuario));
        } catch (RuntimeException e) {
            log.warn("Error al obtener mensajes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al obtener mensajes del usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Long obtenerIdDelToken(Authentication authentication) {
        String correo = authentication.getName();
        Usuario usuario = usuarioRepository.findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getIdUsuario();
    }
}
