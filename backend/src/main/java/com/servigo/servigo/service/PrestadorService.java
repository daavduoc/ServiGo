package com.servigo.servigo.service;

import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.entity.Prestador;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final UsuarioRepository usuarioRepository;

    public PrestadorService(PrestadorRepository prestadorRepository, UsuarioRepository usuarioRepository) {
        this.prestadorRepository = prestadorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Prestador> listarPrestadores() {
        return prestadorRepository.findAll();
    }

    public Prestador obtenerPrestadorPorId(Long id) {
        return prestadorRepository.findById(id).orElse(null);
    }

    public Prestador crearPrestador(Prestador prestador) {

        Usuario usuario = usuarioRepository.findById(prestador.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        prestador.setUsuario(usuario);

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

            Usuario usuario = usuarioRepository.findById(prestadorActualizado.getUsuario().getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            prestador.setUsuario(usuario);
            prestador.setEmpresa(prestadorActualizado.getEmpresa());

            return prestadorRepository.save(prestador);
        }

        return null;
    }

    public void eliminarPrestador(Long id) {
        prestadorRepository.deleteById(id);
    }
}