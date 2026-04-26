package com.servigo.servigo.service;

import com.servigo.servigo.entity.Especialidad;
import com.servigo.servigo.repository.EspecialidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    public List<Especialidad> listarEspecialidades() {
        return especialidadRepository.findAll();
    }

    public Especialidad obtenerEspecialidadPorId(Long id) {
        return especialidadRepository.findById(id).orElse(null);
    }

    public Especialidad crearEspecialidad(Especialidad especialidad) {
        return especialidadRepository.save(especialidad);
    }

    public void eliminarEspecialidad(Long id) {
        especialidadRepository.deleteById(id);
    }
}