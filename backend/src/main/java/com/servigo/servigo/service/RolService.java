package com.servigo.servigo.service;

import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    public Rol obtenerRolPorId(Long id) {
        return rolRepository.findById(id).orElse(null);
    }

    public Rol crearRol(Rol rol) {
        return rolRepository.save(rol);
    }

    public void eliminarRol(Long id) {
        rolRepository.deleteById(id);
    }

    public Rol actualizarRol(Long id, Rol rolActualizado) {

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        rol.setNombre(rolActualizado.getNombre());

        return rolRepository.save(rol);
    }
}