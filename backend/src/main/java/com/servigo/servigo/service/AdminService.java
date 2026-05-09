package com.servigo.servigo.service;

import com.servigo.servigo.dto.AdminUsuarioDTO;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;

    public AdminService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<AdminUsuarioDTO> listarUsuarios() {

        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream().map(usuario -> {

            AdminUsuarioDTO dto = new AdminUsuarioDTO();

            dto.setIdUsuario(usuario.getIdUsuario());
            dto.setNombre(usuario.getNombre());
            dto.setApellido(usuario.getApellido());
            dto.setCorreo(usuario.getCorreo());
            dto.setEstado(usuario.getEstado());
            dto.setRol(usuario.getRol().getNombre());

            return dto;

        }).collect(Collectors.toList());
    }
}