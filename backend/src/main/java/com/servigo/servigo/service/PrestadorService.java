package com.servigo.servigo.service;

import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.repository.PrestadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;

    public PrestadorService(PrestadorRepository prestadorRepository) {
        this.prestadorRepository = prestadorRepository;
    }

    public List<Prestador> listarPrestadores() {
        return prestadorRepository.findAll();
    }

    public Prestador obtenerPrestadorPorId(Long id) {
        return prestadorRepository.findById(id).orElse(null);
    }

    public Prestador crearPrestador(Prestador prestador) {
        return prestadorRepository.save(prestador);
    }

    public Prestador actualizarPrestador(Long id, Prestador prestadorActualizado) {
        Prestador prestador = prestadorRepository.findById(id).orElse(null);

        if (prestador != null) {
            prestador.setTipoPrestador(prestadorActualizado.getTipoPrestador());
            prestador.setDescripcion(prestadorActualizado.getDescripcion());
            prestador.setExperiencia(prestadorActualizado.getExperiencia());
            prestador.setDireccionLocal(prestadorActualizado.getDireccionLocal());
            prestador.setEstadoValidacion(prestadorActualizado.getEstadoValidacion());
            prestador.setUsuario(prestadorActualizado.getUsuario());
            prestador.setEmpresa(prestadorActualizado.getEmpresa());

            return prestadorRepository.save(prestador);
        }

        return null;
    }

    public void eliminarPrestador(Long id) {
        prestadorRepository.deleteById(id);
    }
}