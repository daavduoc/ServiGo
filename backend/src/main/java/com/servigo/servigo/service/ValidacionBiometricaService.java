package com.servigo.servigo.service;

import com.servigo.servigo.entity.ValidacionBiometrica;
import com.servigo.servigo.repository.ValidacionBiometricaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ValidacionBiometricaService {

    private final ValidacionBiometricaRepository validacionRepository;

    public ValidacionBiometricaService(ValidacionBiometricaRepository validacionRepository) {
        this.validacionRepository = validacionRepository;
    }

    public List<ValidacionBiometrica> listarValidaciones() {
        return validacionRepository.findAll();
    }

    public ValidacionBiometrica obtenerValidacionPorId(Long id) {
        return validacionRepository.findById(id).orElse(null);
    }

    public ValidacionBiometrica crearValidacion(ValidacionBiometrica validacion) {

        if (validacion.getFechaValidacion() == null) {
            validacion.setFechaValidacion(LocalDateTime.now());
        }

        if (validacion.getResultado() == null) {
            validacion.setResultado("pendiente");
        }

        return validacionRepository.save(validacion);
    }

    public ValidacionBiometrica actualizarValidacion(Long id, ValidacionBiometrica validacionActualizada) {
        ValidacionBiometrica validacion = validacionRepository.findById(id).orElse(null);

        if (validacion != null) {
            validacion.setTipoValidacion(validacionActualizada.getTipoValidacion());
            validacion.setUrlFotoCapturada(validacionActualizada.getUrlFotoCapturada());
            validacion.setPorcentajeCoincidencia(validacionActualizada.getPorcentajeCoincidencia());
            validacion.setResultado(validacionActualizada.getResultado());
            validacion.setFechaValidacion(validacionActualizada.getFechaValidacion());
            validacion.setObservacion(validacionActualizada.getObservacion());
            validacion.setSolicitud(validacionActualizada.getSolicitud());
            validacion.setUsuario(validacionActualizada.getUsuario());

            return validacionRepository.save(validacion);
        }

        return null;
    }

    public void eliminarValidacion(Long id) {
        validacionRepository.deleteById(id);
    }
}