package com.servigo.servigo.service;

import com.servigo.servigo.dto.CambiarPasswordDTO;
import com.servigo.servigo.dto.LoginRequestDTO;
import com.servigo.servigo.dto.LoginResponseDTO;
import com.servigo.servigo.dto.RecuperarPasswordDTO;
import com.servigo.servigo.dto.ValidarCodigoDTO;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.jwt.JwtUtil;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getContrasena().equals(dto.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generarToken(
                usuario.getCorreo(),
                usuario.getRol().getNombre()
        );

        return new LoginResponseDTO(
                token,
                usuario.getCorreo(),
                usuario.getRol().getNombre()
        );
    }

    public String recuperarPassword(RecuperarPasswordDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String codigo = String.valueOf(100000 + new Random().nextInt(900000));

        usuario.setCodigoRecuperacion(codigo);
        usuario.setCodigoExpiracion(LocalDateTime.now().plusMinutes(10));

        usuarioRepository.save(usuario);

        System.out.println("Código de recuperación para " + usuario.getCorreo() + ": " + codigo);

        return "Código de recuperación generado. Revisa tu correo.";
    }

    public String validarCodigo(ValidarCodigoDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCodigoRecuperacion() == null) {
            throw new RuntimeException("No hay código activo");
        }

        if (usuario.getCodigoExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código expiró");
        }

        if (!usuario.getCodigoRecuperacion().equals(dto.getCodigo())) {
            throw new RuntimeException("Código inválido");
        }

        return "Código válido";
    }

    public String cambiarPassword(CambiarPasswordDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCodigoRecuperacion() == null) {
            throw new RuntimeException("No hay código activo");
        }

        if (usuario.getCodigoExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código expiró");
        }

        if (!usuario.getCodigoRecuperacion().equals(dto.getCodigo())) {
            throw new RuntimeException("Código inválido");
        }

        usuario.setContrasena(dto.getNuevaContrasena());
        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoExpiracion(null);

        usuarioRepository.save(usuario);

        return "Contraseña actualizada correctamente";
    }
}