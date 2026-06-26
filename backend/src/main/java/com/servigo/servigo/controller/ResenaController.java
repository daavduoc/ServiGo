package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Resena;
import com.servigo.servigo.service.ResenaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar reseñas
@RestController
@RequestMapping("/resenas")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    // GET: listar reseñas
    // URL: http://localhost:8080/resenas
    @GetMapping
    public List<Resena> listarResenas() {
        return resenaService.listarResenas();
    }

    // GET: obtener reseña por ID
    // URL: http://localhost:8080/resenas/{id}
    @GetMapping("/{id}")
    public Resena obtenerResena(@PathVariable Long id) {
        return resenaService.obtenerResenaPorId(id);
    }

    // POST: crear reseña
    // URL: http://localhost:8080/resenas
    @PostMapping
    public Resena crearResena(@RequestBody Resena resena) {
        return resenaService.crearResena(resena);
    }

    // PUT: actualizar reseña
    // URL: http://localhost:8080/resenas/{id}
    @PutMapping("/{id}")
    public Resena actualizarResena(@PathVariable Long id, @RequestBody Resena resenaActualizada) {
        return resenaService.actualizarResena(id, resenaActualizada);
    }

    // DELETE: eliminar reseña
    // URL: http://localhost:8080/resenas/{id}
    @DeleteMapping("/{id}")
    public void eliminarResena(@PathVariable Long id) {
        resenaService.eliminarResena(id);
    }
}