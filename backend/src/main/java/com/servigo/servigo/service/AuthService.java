package com.servigo.servigo.service;

import com.servigo.servigo.dto.CambiarPasswordDTO;
import com.servigo.servigo.dto.LoginRequestDTO;
import com.servigo.servigo.dto.LoginResponseDTO;
import com.servigo.servigo.dto.RecuperarPasswordDTO;
import com.servigo.servigo.dto.ValidarCodigoDTO;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.jwt.JwtUtil;
import com.servigo.servigo.repository.FotoPerfilRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.security.SecureRandom;

import static com.servigo.servigo.repository.UsuarioRepository.normalizarCorreo;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final FotoPerfilRepository fotoPerfilRepository;
    private final PrestadorRepository prestadorRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UsuarioRepository usuarioRepository,
            FotoPerfilRepository fotoPerfilRepository,
            PrestadorRepository prestadorRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.fotoPerfilRepository = fotoPerfilRepository;
        this.prestadorRepository = prestadorRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(normalizarCorreo(dto.getCorreo()));

        if (!passwordEncoder.matches(
                dto.getContrasena(),
                usuario.getContrasena()
        )) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        validarAccesoLogin(usuario);

        String token = jwtUtil.generarToken(
                usuario.getCorreo(),
                usuario.getRol().getNombre()
        );

        String urlFotoCloud = fotoPerfilRepository
                .findByUsuario_IdUsuario(usuario.getIdUsuario())
                .map(foto -> foto.getUrlFotoCloud())
                .orElse(null);

        return new LoginResponseDTO(
                token,
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
                usuario.getRol().getNombre(),
                urlFotoCloud
        );
    }

    public String recuperarPassword(RecuperarPasswordDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(normalizarCorreo(dto.getCorreo()));

        String codigo = String.valueOf(100000 + secureRandom.nextInt(900000));

        usuario.setCodigoRecuperacion(codigo);
        usuario.setCodigoExpiracion(LocalDateTime.now().plusHours(1));

        usuarioRepository.save(usuario);

        emailService.enviarCodigoRecuperacion(usuario.getCorreo(), codigo);

        return "Código de recuperación enviado. Revisa tu correo.";
    }

    public String validarCodigo(ValidarCodigoDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(dto.getCorreo());

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

    public String verificarCorreo(ValidarCodigoDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(dto.getCorreo());

        if (usuario.getCorreoValidado()) {
            return "El correo ya está verificado";
        }

        if (usuario.getCodigoRecuperacion() == null) {
            throw new RuntimeException("No hay código de verificación activo");
        }

        if (usuario.getCodigoExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código de verificación expiró");
        }

        if (!usuario.getCodigoRecuperacion().equals(dto.getCodigo())) {
            throw new RuntimeException("Código de verificación inválido");
        }

        usuario.setCorreoValidado(true);
        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoExpiracion(null);
        usuarioRepository.save(usuario);

        return "Correo verificado correctamente";
    }

    public String reenviarCodigoVerificacion(RecuperarPasswordDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(dto.getCorreo());

        if (Boolean.TRUE.equals(usuario.getCorreoValidado())) {
            return "El correo ya está verificado";
        }

        String codigo = String.valueOf(100000 + secureRandom.nextInt(900000));

        usuario.setCodigoRecuperacion(codigo);
        usuario.setCodigoExpiracion(LocalDateTime.now().plusHours(24));
        usuarioRepository.save(usuario);

        emailService.enviarCodigoVerificacion(usuario.getCorreo(), codigo);

        return "Código reenviado. Revisa tu correo.";
    }

    public String cambiarPassword(CambiarPasswordDTO dto) {

        Usuario usuario = buscarUsuarioPorCorreo(dto.getCorreo());

        if (usuario.getCodigoRecuperacion() == null) {
            throw new RuntimeException("No hay código activo");
        }

        if (usuario.getCodigoExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código expiró");
        }

        if (!usuario.getCodigoRecuperacion().equals(dto.getCodigo())) {
            throw new RuntimeException("Código inválido");
        }

        usuario.setContrasena(
                passwordEncoder.encode(dto.getNuevaContrasena())
        );

        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoExpiracion(null);

        usuarioRepository.save(usuario);

        return "Contraseña actualizada correctamente";
    }

    private Usuario buscarUsuarioPorCorreo(String correo) {
        return usuarioRepository
                .findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(normalizarCorreo(correo))
                .orElseThrow(() -> new RuntimeException("No existe una cuenta con ese correo electrónico"));
    }

    private void validarAccesoLogin(Usuario usuario) {
        String rol = usuario.getRol().getNombre().trim().toUpperCase();

        if ("ADMIN".equals(rol)) {
            return;
        }

        if ("CLIENTE".equals(rol)) {
            if (!Boolean.TRUE.equals(usuario.getCorreoValidado())) {
                throw new RuntimeException(
                        "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja o solicita un nuevo código."
                );
            }
            return;
        }

        if ("PRESTADOR".equals(rol)) {
            Prestador prestador = prestadorRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("No se encontró el perfil de especialista asociado a tu cuenta."));

            String estadoValidacion = prestador.getEstadoValidacion() != null
                    ? prestador.getEstadoValidacion().trim().toLowerCase()
                    : "";

            if ("rechazado".equals(estadoValidacion)) {
                throw new RuntimeException(
                        "Tu solicitud como especialista fue rechazada. Escríbenos a soporte si necesitas más información."
                );
            }

            if (!"validado".equals(estadoValidacion)) {
                throw new RuntimeException(
                        "Tu cuenta está en revisión. Podrás iniciar sesión cuando el equipo de ServiGo apruebe tu perfil (plazo estimado: 24 horas hábiles)."
                );
            }
        }
    }
}