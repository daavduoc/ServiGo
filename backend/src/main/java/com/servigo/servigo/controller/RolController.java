package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Indica que esta clase es un controlador REST (API)
@RestController

// Ruta base: http://localhost:8080/roles
@RequestMapping("/roles")
public class RolController {

    // Inyección del servicio (donde está la lógica de negocio)
    private final RolService rolService;

    // Constructor (Spring inyecta automáticamente el service)
    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    // GET: Obtener todos los roles
    // URL: http://localhost:8080/roles
    @GetMapping
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }

    // GET: Obtener un rol por ID
    // URL: http://localhost:8080/roles/1
    @GetMapping("/{id}")
    public Rol obtenerRol(@PathVariable Long id) {
        return rolService.obtenerRolPorId(id);
    }

    // POST: Crear un nuevo rol
    // URL: http://localhost:8080/roles
    // Recibe JSON en el body
    @PostMapping
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.crearRol(rol);
    }

    // DELETE: Eliminar rol por ID
    // URL: http://localhost:8080/roles/1
    @DeleteMapping("/{id}")
    public void eliminarRol(@PathVariable Long id) {
        rolService.eliminarRol(id);
    }

    // PUT: actualizar rol
    // URL: http://localhost:8080/roles/{id}
    @PutMapping("/{id}")
    public Rol actualizarRol(@PathVariable Long id, @RequestBody Rol rolActualizado) {
        return rolService.actualizarRol(id, rolActualizado);
    }
}