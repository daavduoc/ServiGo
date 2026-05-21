package com.servigo.servigo;

import com.servigo.servigo.dto.LoginRequestDTO;
import com.servigo.servigo.dto.LoginResponseDTO;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.jwt.JwtUtil;
import com.servigo.servigo.repository.FotoPerfilRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.service.AuthService;
import com.servigo.servigo.service.EmailService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    private UsuarioRepository usuarioRepository;

    private FotoPerfilRepository fotoPerfilRepository;

    private JwtUtil jwtUtil;

    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {

        usuarioRepository = Mockito.mock(UsuarioRepository.class);

        fotoPerfilRepository = Mockito.mock(FotoPerfilRepository.class);

        jwtUtil = Mockito.mock(JwtUtil.class);

        passwordEncoder = new BCryptPasswordEncoder();

        authService = new AuthService(
                usuarioRepository,
                fotoPerfilRepository,
                jwtUtil,
                passwordEncoder,
                Mockito.mock(EmailService.class)
        );
    }

    @Test
    void loginCorrectoDebeRetornarToken() {

        Rol rol = new Rol();
        rol.setNombre("ADMIN");

        Usuario usuario = new Usuario();

        usuario.setIdUsuario(1L);
        usuario.setCorreo("admin@test.com");

        usuario.setContrasena(
                passwordEncoder.encode("Admin123")
        );

        usuario.setRol(rol);

        when(usuarioRepository.findByCorreo("admin@test.com"))
                .thenReturn(Optional.of(usuario));

        when(fotoPerfilRepository.findByUsuario_IdUsuario(1L))
                .thenReturn(Optional.empty());

        when(jwtUtil.generarToken("admin@test.com", "ADMIN"))
                .thenReturn("TOKEN_TEST");

        LoginRequestDTO dto = new LoginRequestDTO();

        dto.setCorreo("admin@test.com");
        dto.setContrasena("Admin123");

        LoginResponseDTO response = authService.login(dto);

        assertNotNull(response);

        assertEquals("TOKEN_TEST", response.getToken());

        assertEquals("ADMIN", response.getRol());
    }

    @Test
    void loginConPasswordIncorrectaDebeLanzarError() {

        Rol rol = new Rol();
        rol.setNombre("ADMIN");

        Usuario usuario = new Usuario();

        usuario.setCorreo("admin@test.com");

        usuario.setContrasena(
                passwordEncoder.encode("Admin123")
        );

        usuario.setRol(rol);

        when(usuarioRepository.findByCorreo("admin@test.com"))
                .thenReturn(Optional.of(usuario));

        LoginRequestDTO dto = new LoginRequestDTO();

        dto.setCorreo("admin@test.com");
        dto.setContrasena("ClaveIncorrecta");

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(dto)
        );

        assertEquals(
                "Contraseña incorrecta",
                exception.getMessage()
        );
    }
}