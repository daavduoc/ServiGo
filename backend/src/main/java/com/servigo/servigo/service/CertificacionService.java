package com.servigo.servigo.service;

import com.servigo.servigo.entity.Certificacion;
import com.servigo.servigo.repository.CertificacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificacionService {

    private final CertificacionRepository certificacionRepository;

    public CertificacionService(CertificacionRepository certificacionRepository) {
        this.certificacionRepository = certificacionRepository;
    }

    public List<Certificacion> listarCertificaciones() {
        return certificacionRepository.findAll();
    }

    public Certificacion obtenerCertificacionPorId(Long id) {
        return certificacionRepository.findById(id).orElse(null);
    }

    public Certificacion crearCertificacion(Certificacion certificacion) {
        return certificacionRepository.save(certificacion);
    }

    public Certificacion actualizarCertificacion(Long id, Certificacion certificacionActualizada) {
        Certificacion certificacion = certificacionRepository.findById(id).orElse(null);

        if (certificacion != null) {
            certificacion.setNombreDocumento(certificacionActualizada.getNombreDocumento());
            certificacion.setUrlDocumento(certificacionActualizada.getUrlDocumento());
            certificacion.setEstado(certificacionActualizada.getEstado());
            certificacion.setPrestador(certificacionActualizada.getPrestador());

            return certificacionRepository.save(certificacion);
        }

        return null;
    }

    public void eliminarCertificacion(Long id) {
        certificacionRepository.deleteById(id);
    }
}