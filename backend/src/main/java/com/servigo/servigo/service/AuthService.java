package com.servigo.servigo.service;

import com.servigo.servigo.dto.LoginRequestDTO;
import com.servigo.servigo.dto.LoginResponseDTO;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getContrasena().equals(dto.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = "TOKEN_TEMPORAL";

        return new LoginResponseDTO(
                token,
                usuario.getCorreo(),
                usuario.getRol().getNombre()
        );
    }
}