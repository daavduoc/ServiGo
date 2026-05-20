package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Especialidad;
import com.servigo.servigo.service.EspecialidadService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Indica que esta clase es un controlador REST (API)
@RestController

// Define la ruta base: http://localhost:8080/especialidades
@RequestMapping("/especialidades")
public class EspecialidadController {

    // Inyección del servicio (donde está la lógica)
    private final EspecialidadService especialidadService;

    // Constructor (Spring inyecta automáticamente el service)
    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    // GET: Obtener todas las especialidades
    // URL: http://localhost:8080/especialidades
    @GetMapping
    public List<Especialidad> listarEspecialidades() {
        return especialidadService.listarEspecialidades();
    }


    // GET: Obtener especialidad por ID
    // URL: http://localhost:8080/especialidades/1
    @GetMapping("/{id}")
    public Especialidad obtenerEspecialidad(@PathVariable Long id) {
        return especialidadService.obtenerEspecialidadPorId(id);
    }

    // POST: Crear una nueva especialidad (solo admin)
    // URL: http://localhost:8080/especialidades
    // Recibe JSON en el body
    @PostMapping
    public Especialidad crearEspecialidad(@RequestBody Especialidad especialidad) {
        return especialidadService.crearEspecialidad(especialidad);
    }

    // PUT: Actualizar especialidad por ID
    // URL: http://localhost:8080/especialidades/1
    // Recibe JSON en el body
    @PutMapping("/{id}")
    public Especialidad actualizarEspecialidad(@PathVariable Long id, @RequestBody Especialidad especialidadActualizada) {
        Especialidad especialidad = especialidadService.obtenerEspecialidadPorId(id);

        if (especialidad != null) {
            // Actualizamos el nombre
            especialidad.setNombre(especialidadActualizada.getNombre());
            // Guardamos cambios
            return especialidadService.crearEspecialidad(especialidad);
        }
        // Si no existe, retorna null (podriamos reemplazar esto con excepciones o un mensaje de error)
        return null;
    }
    // DELETE: Eliminar especialidad por ID (solo admin)
    // URL: http://localhost:8080/especialidades/1
    @DeleteMapping("/{id}")
    public void eliminarEspecialidad(@PathVariable Long id) {
        especialidadService.eliminarEspecialidad(id);
    }
}

// TODO: Agregar validación de roles para que solo admin pueda crear, actualizar y eliminar
// TODO: Implementar manejo de excepciones personalizadas en lugar de devolver null
// TODO: Agregar anotación @Secured("ROLE_ADMIN") en los métodos POST, PUT, DELETE