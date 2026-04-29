package com.servigo.servigo.controller;

import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar usuarios
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET: listar todos los usuarios
    // URL: http://localhost:8080/usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // GET: obtener usuario por ID
    // URL: http://localhost:8080/usuarios/{id}
    @GetMapping("/{id}")
    public Usuario obtenerUsuario(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id);
    }

    // POST: crear usuario (básico)
    // URL: http://localhost:8080/usuarios
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    // DELETE: eliminar usuario
    // URL: http://localhost:8080/usuarios/{id}
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
    }

    // POST: registro completo de usuario (con DTO)
    // Crea Usuario + Cliente o Prestador automáticamente según tipo
    // URL: http://localhost:8080/usuarios/registro
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody RegistroUsuarioDTO dto) {
        return usuarioService.registrarNuevoUsuario(dto);
    }
}