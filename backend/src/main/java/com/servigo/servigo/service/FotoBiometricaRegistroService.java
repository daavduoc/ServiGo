package com.servigo.servigo.service;

import com.servigo.servigo.dto.FotoBiometricaRegistroAccessDTO;
import com.servigo.servigo.dto.FotoBiometricaRegistroResponseDTO;
import com.servigo.servigo.entity.FotoBiometricaRegistro;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.FotoBiometricaRegistroRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class FotoBiometricaRegistroService {

    private static final int SIGNED_URL_EXPIRATION_SECONDS = 300;

    private final FotoBiometricaRegistroRepository fotoBiometricaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CloudinaryService cloudinaryService;

    public FotoBiometricaRegistroService(
            FotoBiometricaRegistroRepository fotoBiometricaRepository,
            UsuarioRepository usuarioRepository,
            CloudinaryService cloudinaryService
    ) {
        this.fotoBiometricaRepository = fotoBiometricaRepository;
        this.usuarioRepository = usuarioRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional
    public FotoBiometricaRegistroResponseDTO registrarFotoBiometrica(
            Long idUsuario,
            MultipartFile file,
            String createdBy,
            String ipOrigen
    ) {
        if (fotoBiometricaRepository.existsByUsuario_IdUsuario(idUsuario)) {
            throw new IllegalStateException("El usuario ya tiene una foto biometrica de registro registrada. No se puede reemplazar.");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debe enviar un archivo de imagen biometrica");
        }

        Map resultado;
        try {
            resultado = cloudinaryService.subirImagenPrivada(file, "servigo/fotos-biometricas-registro");
        } catch (Exception e) {
            throw new RuntimeException("Error al subir la imagen biometrica a Cloudinary", e);
        }

        String url = resultado.get("secure_url").toString();
        String publicId = resultado.get("public_id").toString();

        FotoBiometricaRegistro foto = new FotoBiometricaRegistro();
        foto.setUsuario(usuario);
        foto.setUrlFotoCloud(url);
        foto.setPublicId(publicId);
        foto.setCreatedBy(createdBy);

        FotoBiometricaRegistro saved = fotoBiometricaRepository.save(foto);

        return convertirResponseDTO(saved);
    }

    @Transactional
    public FotoBiometricaRegistroAccessDTO obtenerFotoParaValidacion(Long idUsuario) {
        FotoBiometricaRegistro foto = fotoBiometricaRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene foto biometrica de registro"));

        if (!"activa".equals(foto.getEstado())) {
            throw new IllegalStateException("La foto biometrica de registro del usuario esta bloqueada");
        }

        String signedUrl = cloudinaryService.generarUrlFirmada(
                foto.getPublicId(),
                SIGNED_URL_EXPIRATION_SECONDS
        );

        FotoBiometricaRegistroAccessDTO dto = new FotoBiometricaRegistroAccessDTO();
        dto.setSignedUrl(signedUrl);
        dto.setPublicId(foto.getPublicId());
        dto.setEstado(foto.getEstado());

        return dto;
    }

    @Transactional
    public void bloquearFotoBiometrica(Long idUsuario) {
        FotoBiometricaRegistro foto = fotoBiometricaRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene foto biometrica de registro"));

        foto.bloquear();
        fotoBiometricaRepository.save(foto);
    }

    public boolean existeFotoBiometrica(Long idUsuario) {
        return fotoBiometricaRepository.existsByUsuario_IdUsuario(idUsuario);
    }

    private FotoBiometricaRegistroResponseDTO convertirResponseDTO(FotoBiometricaRegistro foto) {
        FotoBiometricaRegistroResponseDTO dto = new FotoBiometricaRegistroResponseDTO();
        dto.setIdFotoBiometrica(foto.getIdFotoBiometrica());
        dto.setIdUsuario(foto.getUsuario().getIdUsuario());
        dto.setFechaRegistro(foto.getFechaRegistro());
        dto.setEstado(foto.getEstado());
        return dto;
    }
}
