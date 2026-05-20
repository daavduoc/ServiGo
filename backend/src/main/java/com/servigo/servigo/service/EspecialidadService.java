package com.servigo.servigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servigo.servigo.entity.Especialidad;
import com.servigo.servigo.repository.EspecialidadRepository;

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
    
}// TODO: Agregar validaciones para que el nombre no esté vacío o nulo
// TODO: Lanzar excepciones personalizadas (ej: EspecialidadNoEncontradaException) en lugar de devolver null
// TODO: Validar que no existan duplicados al crear especialidades