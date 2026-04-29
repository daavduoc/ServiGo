package com.servigo.servigo.service;

import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.RolRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario registrarNuevoUsuario(RegistroUsuarioDTO dto) {

        // Por ahora usamos el rol CLIENTE ya creado con id 1
        Rol rol = rolRepository.findById(1L).orElse(null);

        Usuario usuario = new Usuario();
        usuario.setRut(dto.getRut());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getContrasena());
        usuario.setTelefono(dto.getTelefono());
        usuario.setEstado("activo");
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}