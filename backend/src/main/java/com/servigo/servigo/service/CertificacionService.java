package com.servigo.servigo.service;

import com.servigo.servigo.entity.Certificacion;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.repository.CertificacionRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CertificacionService {

    private final CertificacionRepository certificacionRepository;
    private final PrestadorRepository prestadorRepository;
    private final CloudinaryService cloudinaryService;

    public CertificacionService(
            CertificacionRepository certificacionRepository,
            PrestadorRepository prestadorRepository,
            CloudinaryService cloudinaryService
    ) {
        this.certificacionRepository = certificacionRepository;
        this.prestadorRepository = prestadorRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public List<Certificacion> listarCertificaciones() {
        return certificacionRepository.findAll();
    }

    public List<Certificacion> listarPorPrestador(Long idPrestador) {
        return certificacionRepository.findByPrestadorIdPrestador(idPrestador);
    }

    public Certificacion obtenerCertificacionPorId(Long id) {
        return certificacionRepository.findById(id).orElse(null);
    }

    public Certificacion subirCertificacion(
            Long idPrestador,
            String nombreDocumento,
            MultipartFile file
    ) throws IOException {

        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        Map resultado = cloudinaryService.subirImagen(file, "servigo/certificaciones");

        String url = resultado.get("secure_url").toString();
        String publicId = resultado.get("public_id").toString();

        Certificacion certificacion = new Certificacion();
        certificacion.setPrestador(prestador);
        certificacion.setNombreDocumento(nombreDocumento);
        certificacion.setUrlDocumento(url);
        certificacion.setPublicId(publicId);
        certificacion.setEstado("pendiente");
        certificacion.setFechaSubida(LocalDateTime.now());

        return certificacionRepository.save(certificacion);
    }

    public Certificacion actualizarEstado(Long id, String estado) {
        Certificacion certificacion = certificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificación no encontrada"));

        certificacion.setEstado(estado);

        return certificacionRepository.save(certificacion);
    }

    public void eliminarCertificacion(Long id) {
        certificacionRepository.deleteById(id);
    }
}