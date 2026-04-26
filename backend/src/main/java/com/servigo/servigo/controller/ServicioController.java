package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.service.ServicioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Indica que esta clase es un controlador REST (API)
@RestController

// Define la ruta base: http://localhost:8080/servicios
@RequestMapping("/servicios")
public class ServicioController {

    // Inyección del servicio (donde está la lógica)
    private final ServicioService servicioService;

    // Constructor (Spring inyecta automáticamente el service)
    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    // GET: Obtener todos los servicios
    // URL: http://localhost:8080/servicios
    @GetMapping
    public List<Servicio> listarServicios() {
        return servicioService.listarServicios();
    }

    // GET: Obtener servicio por ID
    // URL: http://localhost:8080/servicios/1
    @GetMapping("/{id}")
    public Servicio obtenerServicio(@PathVariable Long id) {
        return servicioService.obtenerServicioPorId(id);
    }

    // POST: Crear un nuevo servicio (solo prestador/admin)
    // URL: http://localhost:8080/servicios
    // Recibe JSON en el body
    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioService.crearServicio(servicio);
    }

    // PUT: Actualizar servicio por ID (solo prestador/admin)
    // URL: http://localhost:8080/servicios/1
    // Recibe JSON en el body
    @PutMapping("/{id}")
    public Servicio actualizarServicio(@PathVariable Long id, @RequestBody Servicio servicioActualizado) {
        return servicioService.actualizarServicio(id, servicioActualizado);
    }

    // DELETE: Eliminar servicio por ID (solo prestador/admin)
    // URL: http://localhost:8080/servicios/1
    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
    }
}