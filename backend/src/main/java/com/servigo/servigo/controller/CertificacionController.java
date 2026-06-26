package com.servigo.servigo.controller;

import com.servigo.servigo.dto.CertificacionResponseDTO;
import com.servigo.servigo.service.CertificacionService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/certificaciones")
public class CertificacionController {

    private final CertificacionService certificacionService;

    public CertificacionController(CertificacionService certificacionService) {
        this.certificacionService = certificacionService;
    }

    @GetMapping
    public List<CertificacionResponseDTO> listarCertificaciones() {
        return certificacionService.listarCertificaciones();
    }

    @GetMapping("/{id}")
    public CertificacionResponseDTO obtenerCertificacion(@PathVariable Long id) {
        return certificacionService.obtenerCertificacionPorId(id);
    }

    @GetMapping("/prestador/{idPrestador}")
    public List<CertificacionResponseDTO> listarPorPrestador(@PathVariable Long idPrestador) {
        return certificacionService.listarPorPrestador(idPrestador);
    }

    @PostMapping(
            value = "/upload/{idPrestador}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CertificacionResponseDTO subirCertificacion(
            @PathVariable Long idPrestador,
            @RequestParam("nombreDocumento") String nombreDocumento,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return certificacionService.subirCertificacion(
                idPrestador,
                nombreDocumento,
                file
        );
    }

    @PutMapping("/{id}/estado")
    public CertificacionResponseDTO actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado
    ) {
        return certificacionService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public void eliminarCertificacion(@PathVariable Long id) {
        certificacionService.eliminarCertificacion(id);
    }
}