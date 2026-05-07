package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Certificacion;
import com.servigo.servigo.service.CertificacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar certificaciones de prestadores
@RestController
@RequestMapping("/certificaciones")
public class CertificacionController {

    private final CertificacionService certificacionService;

    public CertificacionController(CertificacionService certificacionService) {
        this.certificacionService = certificacionService;
    }

    // GET: listar certificaciones
    // URL: http://localhost:8080/certificaciones
    @GetMapping
    public List<Certificacion> listarCertificaciones() {
        return certificacionService.listarCertificaciones();
    }

    // GET: obtener certificación por ID
    // URL: http://localhost:8080/certificaciones/{id}
    @GetMapping("/{id}")
    public Certificacion obtenerCertificacion(@PathVariable Long id) {
        return certificacionService.obtenerCertificacionPorId(id);
    }

    // POST: crear certificación
    // URL: http://localhost:8080/certificaciones
    @PostMapping
    public Certificacion crearCertificacion(@RequestBody Certificacion certificacion) {
        return certificacionService.crearCertificacion(certificacion);
    }

    // PUT: actualizar certificación
    // URL: http://localhost:8080/certificaciones/{id}
    @PutMapping("/{id}")
    public Certificacion actualizarCertificacion(@PathVariable Long id, @RequestBody Certificacion certificacionActualizada) {
        return certificacionService.actualizarCertificacion(id, certificacionActualizada);
    }

    // DELETE: eliminar certificación
    // URL: http://localhost:8080/certificaciones/{id}
    @DeleteMapping("/{id}")
    public void eliminarCertificacion(@PathVariable Long id) {
        certificacionService.eliminarCertificacion(id);
    }
}