package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.service.DisponibilidadService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
// Indica que esta clase es un controlador REST (API)
@RestController

// Define la ruta base: http://localhost:8080/disponibilidad
@RequestMapping("/disponibilidad")
public class DisponibilidadController {

    // Inyección del servicio (donde está la lógica)
    private final DisponibilidadService disponibilidadService;

    // Constructor (Spring inyecta automáticamente el service)
    public DisponibilidadController(DisponibilidadService disponibilidadService) {
        this.disponibilidadService = disponibilidadService;
    }

    // GET: Obtener todas la disponibilidades
    // URL: http://localhost:8080/disponibilidad
    @GetMapping
    public List<Disponibilidad> listarDisponibilidades() {
        return disponibilidadService.listarDisponibilidades();
    }

    // GET: Obtener disponibilidad por ID
    // URL: http://localhost:8080/disponibilidad/1
    @GetMapping("/{id}")
    public Disponibilidad obtenerDisponibilidad(@PathVariable Long id) {
        return disponibilidadService.obtenerDisponibilidadPorId(id);
    }

    // POST: Crear una nueva disponibilidad (solo prestador)
    // URL: http://localhost:8080/disponibilidad
    // Recibe JSON en el body
    @PostMapping
    public Disponibilidad crearDisponibilidad(@RequestBody Disponibilidad disponibilidad) {
        return disponibilidadService.crearDisponibilidad(disponibilidad);
    }

    // PUT: Actualizar disponibilidad por ID (solo prestador)
    // URL: http://localhost:8080/disponibilidad/1
    // Recibe JSON en el body
    @PutMapping("/{id}")
    public Disponibilidad actualizarDisponibilidad(@PathVariable Long id, @RequestBody Disponibilidad disponibilidadActualizada) {
        return disponibilidadService.actualizarDisponibilidad(id, disponibilidadActualizada);
    }

    // DELETE: Eliminar disponibilidad por ID (solo prestador)
    // URL: http://localhost:8080/disponibilidad/1
    @DeleteMapping("/{id}")
    public void eliminarDisponibilidad(@PathVariable Long id) {
        disponibilidadService.eliminarDisponibilidad(id);
    }
}

// TODO: Agregar validación de roles para que solo prestador pueda crear, actualizar y eliminar
// TODO: Implementar manejo de excepciones personalizadas en lugar de devolver null
// TODO: Agregar anotación @Secured("ROLE_PRESTADOR") en los métodos POST, PUT, DELETE