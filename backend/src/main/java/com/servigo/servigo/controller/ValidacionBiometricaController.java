package com.servigo.servigo.controller;

import com.servigo.servigo.entity.ValidacionBiometrica;
import com.servigo.servigo.service.ValidacionBiometricaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar validaciones biométricas
@RestController
@RequestMapping("/validaciones-biometricas")
public class ValidacionBiometricaController {

    private final ValidacionBiometricaService validacionService;

    public ValidacionBiometricaController(ValidacionBiometricaService validacionService) {
        this.validacionService = validacionService;
    }

    // GET: listar validaciones biométricas
    // URL: http://localhost:8080/validaciones-biometricas
    @GetMapping
    public List<ValidacionBiometrica> listarValidaciones() {
        return validacionService.listarValidaciones();
    }

    // GET: obtener validación por ID
    // URL: http://localhost:8080/validaciones-biometricas/{id}
    @GetMapping("/{id}")
    public ValidacionBiometrica obtenerValidacion(@PathVariable Long id) {
        return validacionService.obtenerValidacionPorId(id);
    }

    // POST: crear validación biométrica
    // URL: http://localhost:8080/validaciones-biometricas
    @PostMapping
    public ValidacionBiometrica crearValidacion(@RequestBody ValidacionBiometrica validacion) {
        return validacionService.crearValidacion(validacion);
    }

    // PUT: actualizar validación biométrica
    // URL: http://localhost:8080/validaciones-biometricas/{id}
    @PutMapping("/{id}")
    public ValidacionBiometrica actualizarValidacion(@PathVariable Long id, @RequestBody ValidacionBiometrica validacionActualizada) {
        return validacionService.actualizarValidacion(id, validacionActualizada);
    }

    // DELETE: eliminar validación biométrica
    // URL: http://localhost:8080/validaciones-biometricas/{id}
    @DeleteMapping("/{id}")
    public void eliminarValidacion(@PathVariable Long id) {
        validacionService.eliminarValidacion(id);
    }
}