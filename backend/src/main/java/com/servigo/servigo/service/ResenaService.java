package com.servigo.servigo.service;

import com.servigo.servigo.entity.Resena;
import com.servigo.servigo.repository.ResenaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;

    public ResenaService(ResenaRepository resenaRepository) {
        this.resenaRepository = resenaRepository;
    }

    public List<Resena> listarResenas() {
        return resenaRepository.findAll();
    }

    public Resena obtenerResenaPorId(Long id) {
        return resenaRepository.findById(id).orElse(null);
    }

    public Resena crearResena(Resena resena) {
        if (resena.getFechaResena() == null) {
            resena.setFechaResena(LocalDateTime.now());
        }

        return resenaRepository.save(resena);
    }

    public Resena actualizarResena(Long id, Resena resenaActualizada) {
        Resena resena = resenaRepository.findById(id).orElse(null);

        if (resena != null) {
            resena.setPuntuacion(resenaActualizada.getPuntuacion());
            resena.setComentario(resenaActualizada.getComentario());
            resena.setFechaResena(resenaActualizada.getFechaResena());
            resena.setReserva(resenaActualizada.getReserva());
            resena.setCliente(resenaActualizada.getCliente());

            return resenaRepository.save(resena);
        }

        return null;
    }

    public void eliminarResena(Long id) {
        resenaRepository.deleteById(id);
    }
}