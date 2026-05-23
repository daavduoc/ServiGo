package com.servigo.servigo.controller;

import com.servigo.servigo.dto.PrestadorBusquedaDTO;
import com.servigo.servigo.dto.PrestadorPublicoDetalleDTO;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.service.PrestadorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar prestadores
@RestController
@RequestMapping("/prestadores")
public class PrestadorController {

    private final PrestadorService prestadorService;

    // Spring inyecta automáticamente el service
    public PrestadorController(PrestadorService prestadorService) {
        this.prestadorService = prestadorService;
    }

    // GET: Listar todos los prestadores
    // URL: http://localhost:8080/prestadores
    @GetMapping
    public List<Prestador> listarPrestadores(
            @RequestParam(required = false) String categoria
    ) {
        if (categoria != null && !categoria.isBlank()) {
            return prestadorService.listarPorCategoria(categoria);
        }

        return prestadorService.listarPrestadores();
    }

    @GetMapping("/publicos")
    public List<PrestadorBusquedaDTO> listarPrestadoresPublicos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String query
    ) {
        return prestadorService.listarPrestadoresPublicos(categoria, query);
    }

    @GetMapping("/publicos/{id}")
    public PrestadorPublicoDetalleDTO obtenerPrestadorPublico(@PathVariable Long id) {
        return prestadorService.obtenerPrestadorPublicoPorId(id);
    }

    // GET: Obtener prestador por ID
    // URL: http://localhost:8080/prestadores/1
    @GetMapping("/{id}")
    public Prestador obtenerPrestador(@PathVariable Long id) {
        return prestadorService.obtenerPrestadorPorId(id);
    }

    // POST: Crear prestador
    // URL: http://localhost:8080/prestadores
    @PostMapping
    public Prestador crearPrestador(@RequestBody Prestador prestador) {
        return prestadorService.crearPrestador(prestador);
    }

    // PUT: Actualizar prestador
    // URL: http://localhost:8080/prestadores/1
    @PutMapping("/{id}")
    public Prestador actualizarPrestador(@PathVariable Long id, @RequestBody Prestador prestadorActualizado) {
        return prestadorService.actualizarPrestador(id, prestadorActualizado);
    }

    // DELETE: Eliminar prestador
    // URL: http://localhost:8080/prestadores/1
    @DeleteMapping("/{id}")
    public void eliminarPrestador(@PathVariable Long id) {
        prestadorService.eliminarPrestador(id);
    }
}