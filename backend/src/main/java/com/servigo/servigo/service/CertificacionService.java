package com.servigo.servigo.service;

import com.servigo.servigo.dto.CertificacionResponseDTO;
import com.servigo.servigo.entity.Certificacion;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.repository.CertificacionRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

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

    public List<CertificacionResponseDTO> listarCertificaciones() {
        return certificacionRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    public List<CertificacionResponseDTO> listarPorPrestador(Long idPrestador) {
        return certificacionRepository.findByPrestadorIdPrestador(idPrestador)
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    public CertificacionResponseDTO obtenerCertificacionPorId(Long id) {
        Certificacion certificacion = certificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificación no encontrada"));

        return convertirDTO(certificacion);
    }

    public CertificacionResponseDTO subirCertificacion(
            Long idPrestador,
            String nombreDocumento,
            MultipartFile file
    ) throws IOException {

        Prestador prestador = prestadorRepository.findById(idPrestador)
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));

        Map resultado = cloudinaryService.subirDocumento(file, "servigo/certificaciones");

        String url = resultado.get("secure_url").toString();
        String publicId = resultado.get("public_id").toString();

        Certificacion certificacion = new Certificacion();
        certificacion.setPrestador(prestador);
        certificacion.setNombreDocumento(nombreDocumento);
        certificacion.setUrlDocumento(url);
        certificacion.setPublicId(publicId);
        certificacion.setEstado("pendiente");
        certificacion.setFechaSubida(LocalDateTime.now());

        Certificacion guardada = certificacionRepository.save(certificacion);

        return convertirDTO(guardada);
    }

    public List<CertificacionResponseDTO> subirCertificacionesRegistro(
            Long idPrestador,
            MultipartFile[] files
    ) throws IOException {

        if (files == null || files.length == 0) {
            return List.of();
        }

        return Arrays.stream(files)
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String nombre = file.getOriginalFilename() != null
                                ? file.getOriginalFilename()
                                : "documento";
                        return subirCertificacion(idPrestador, nombre, file);
                    } catch (IOException e) {
                        throw new RuntimeException("Error al subir certificación: " + e.getMessage(), e);
                    }
                }))
                .map(CompletableFuture::join)
                .filter(Objects::nonNull)
                .toList();
    }

    public CertificacionResponseDTO actualizarEstado(Long id, String estado) {

        if (!estado.equalsIgnoreCase("pendiente")
                && !estado.equalsIgnoreCase("validado")
                && !estado.equalsIgnoreCase("rechazado")) {
            throw new RuntimeException("Estado de certificación inválido");
        }

        Certificacion certificacion = certificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificación no encontrada"));

        certificacion.setEstado(estado.toLowerCase());

        Certificacion actualizada = certificacionRepository.save(certificacion);

        return convertirDTO(actualizada);
    }

    public void eliminarCertificacion(Long id) {
        certificacionRepository.deleteById(id);
    }

    private CertificacionResponseDTO convertirDTO(Certificacion certificacion) {

        CertificacionResponseDTO dto = new CertificacionResponseDTO();

        dto.setIdCertificacion(certificacion.getIdCertificacion());
        dto.setNombreDocumento(certificacion.getNombreDocumento());
        dto.setUrlDocumento(certificacion.getUrlDocumento());
        dto.setPublicId(certificacion.getPublicId());
        dto.setEstado(certificacion.getEstado());
        dto.setFechaSubida(certificacion.getFechaSubida());

        if (certificacion.getPrestador() != null) {
            dto.setIdPrestador(certificacion.getPrestador().getIdPrestador());
        }

        return dto;
    }
}