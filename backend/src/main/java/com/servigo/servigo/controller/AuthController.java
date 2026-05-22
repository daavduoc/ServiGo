package com.servigo.servigo.controller;

import com.servigo.servigo.dto.LoginRequestDTO;
import com.servigo.servigo.dto.LoginResponseDTO;
import com.servigo.servigo.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.servigo.servigo.dto.RecuperarPasswordDTO;
import com.servigo.servigo.dto.ValidarCodigoDTO;
import com.servigo.servigo.dto.CambiarPasswordDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST: iniciar sesión
    // URL: http://localhost:8080/auth/login
    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO dto
    ) {
        return authService.login(dto);
    }

    // POST: recuperar contraseña
    @PostMapping(value = "/recuperar-password", produces = MediaType.TEXT_PLAIN_VALUE + ";charset=UTF-8")
    public String recuperarPassword(
            @Valid @RequestBody RecuperarPasswordDTO dto
    ) {
        return authService.recuperarPassword(dto);
    }

    // POST: validar código
    @PostMapping("/validar-codigo")
    public String validarCodigo(
            @Valid @RequestBody ValidarCodigoDTO dto
    ) {
        return authService.validarCodigo(dto);
    }

    // POST: cambiar contraseña
    @PostMapping("/cambiar-password")
    public String cambiarPassword(
            @Valid @RequestBody CambiarPasswordDTO dto
    ) {
        return authService.cambiarPassword(dto);
    }

    // POST: verificar correo electrónico con código
    @PostMapping("/verificar-correo")
    public String verificarCorreo(
            @Valid @RequestBody ValidarCodigoDTO dto
    ) {
        return authService.verificarCorreo(dto);
    }

    // POST: reenviar código de verificación tras registro
    @PostMapping("/reenviar-codigo-verificacion")
    public String reenviarCodigoVerificacion(
            @Valid @RequestBody RecuperarPasswordDTO dto
    ) {
        return authService.reenviarCodigoVerificacion(dto);
    }
}