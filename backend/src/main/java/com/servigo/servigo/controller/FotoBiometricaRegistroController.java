package com.servigo.servigo.controller;

import com.servigo.servigo.dto.FotoBiometricaRegistroAccessDTO;
import com.servigo.servigo.dto.FotoBiometricaRegistroResponseDTO;
import com.servigo.servigo.service.FotoBiometricaRegistroService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/fotos-biometricas-registro")
public class FotoBiometricaRegistroController {

    private final FotoBiometricaRegistroService fotoBiometricaService;

    public FotoBiometricaRegistroController(FotoBiometricaRegistroService fotoBiometricaService) {
        this.fotoBiometricaService = fotoBiometricaService;
    }

    @PostMapping(
            value = "/registro/{idUsuario}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<FotoBiometricaRegistroResponseDTO> subirFotoBiometrica(
            @PathVariable Long idUsuario,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        String ipOrigen = request.getRemoteAddr();
        String createdBy = request.getUserPrincipal() != null
                ? request.getUserPrincipal().getName()
                : "registro-web";

        FotoBiometricaRegistroResponseDTO response = fotoBiometricaService
                .registrarFotoBiometrica(idUsuario, file, createdBy, ipOrigen);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/existe/{idUsuario}")
    public ResponseEntity<Map<String, Boolean>> existeFotoBiometrica(@PathVariable Long idUsuario) {
        boolean existe = fotoBiometricaService.existeFotoBiometrica(idUsuario);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @GetMapping("/acceso/{idUsuario}")
    public FotoBiometricaRegistroAccessDTO obtenerFotoBiometricaParaValidacion(@PathVariable Long idUsuario) {
        return fotoBiometricaService.obtenerFotoParaValidacion(idUsuario);
    }

    @PutMapping("/bloquear/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> bloquearFotoBiometrica(@PathVariable Long idUsuario) {
        fotoBiometricaService.bloquearFotoBiometrica(idUsuario);
        return ResponseEntity.noContent().build();
    }
}
