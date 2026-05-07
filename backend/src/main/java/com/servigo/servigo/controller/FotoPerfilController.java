package com.servigo.servigo.controller;

import com.servigo.servigo.entity.FotoPerfil;
import com.servigo.servigo.service.FotoPerfilService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar fotos de perfil
@RestController
@RequestMapping("/fotos-perfil")
public class FotoPerfilController {

    private final FotoPerfilService fotoPerfilService;

    public FotoPerfilController(FotoPerfilService fotoPerfilService) {
        this.fotoPerfilService = fotoPerfilService;
    }

    // GET: listar fotos de perfil
    // URL: http://localhost:8080/fotos-perfil
    @GetMapping
    public List<FotoPerfil> listarFotos() {
        return fotoPerfilService.listarFotos();
    }

    // GET: obtener foto por ID
    // URL: http://localhost:8080/fotos-perfil/{id}
    @GetMapping("/{id}")
    public FotoPerfil obtenerFoto(@PathVariable Long id) {
        return fotoPerfilService.obtenerFotoPorId(id);
    }

    // POST: crear foto de perfil
    // URL: http://localhost:8080/fotos-perfil
    @PostMapping
    public FotoPerfil crearFoto(@RequestBody FotoPerfil fotoPerfil) {
        return fotoPerfilService.crearFoto(fotoPerfil);
    }

    // PUT: actualizar foto de perfil
    // URL: http://localhost:8080/fotos-perfil/{id}
    @PutMapping("/{id}")
    public FotoPerfil actualizarFoto(@PathVariable Long id, @RequestBody FotoPerfil fotoActualizada) {
        return fotoPerfilService.actualizarFoto(id, fotoActualizada);
    }

    // DELETE: eliminar foto de perfil
    // URL: http://localhost:8080/fotos-perfil/{id}
    @DeleteMapping("/{id}")
    public void eliminarFoto(@PathVariable Long id) {
        fotoPerfilService.eliminarFoto(id);
    }
}