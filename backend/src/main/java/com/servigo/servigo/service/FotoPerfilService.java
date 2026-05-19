package com.servigo.servigo.service;

import com.servigo.servigo.dto.FotoPerfilResponseDTO;
import com.servigo.servigo.entity.FotoPerfil;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.FotoPerfilRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class FotoPerfilService {

    private final FotoPerfilRepository fotoPerfilRepository;
    private final UsuarioRepository usuarioRepository;
    private final CloudinaryService cloudinaryService;

    public FotoPerfilService(
            FotoPerfilRepository fotoPerfilRepository,
            UsuarioRepository usuarioRepository,
            CloudinaryService cloudinaryService
    ) {
        this.fotoPerfilRepository = fotoPerfilRepository;
        this.usuarioRepository = usuarioRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public List<FotoPerfilResponseDTO> listarFotos() {
        return fotoPerfilRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    public FotoPerfilResponseDTO obtenerFotoPorId(Long id) {
        FotoPerfil fotoPerfil = fotoPerfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foto de perfil no encontrada"));

        return convertirDTO(fotoPerfil);
    }

    public void guardarFotoDesdeUrl(Long idUsuario, String urlFotoCloud) {
        if (urlFotoCloud == null || urlFotoCloud.isBlank()) {
            return;
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        FotoPerfil fotoExistente = fotoPerfilRepository
                .findByUsuarioIdUsuario(idUsuario)
                .orElse(null);

        if (fotoExistente != null) {
            fotoExistente.setUrlFotoCloud(urlFotoCloud);
            fotoPerfilRepository.save(fotoExistente);
            return;
        }

        FotoPerfil fotoPerfil = new FotoPerfil();
        fotoPerfil.setUsuario(usuario);
        fotoPerfil.setUrlFotoCloud(urlFotoCloud);
        fotoPerfilRepository.save(fotoPerfil);
    }

    public FotoPerfilResponseDTO subirFotoPerfil(Long idUsuario, MultipartFile file) throws IOException {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        FotoPerfil fotoExistente = fotoPerfilRepository
                .findByUsuarioIdUsuario(idUsuario)
                .orElse(null);

        Map resultado = cloudinaryService.subirImagen(file, "servigo/fotos-perfil");

        String url = resultado.get("secure_url").toString();
        String publicId = resultado.get("public_id").toString();

        if (fotoExistente != null) {
            fotoExistente.setUrlFotoCloud(url);
            fotoExistente.setPublicId(publicId);

            FotoPerfil fotoActualizada = fotoPerfilRepository.save(fotoExistente);
            return convertirDTO(fotoActualizada);
        }

        FotoPerfil fotoPerfil = new FotoPerfil();
        fotoPerfil.setUsuario(usuario);
        fotoPerfil.setUrlFotoCloud(url);
        fotoPerfil.setPublicId(publicId);

        FotoPerfil fotoGuardada = fotoPerfilRepository.save(fotoPerfil);
        return convertirDTO(fotoGuardada);
    }

    public FotoPerfilResponseDTO crearFoto(FotoPerfil fotoPerfil) {
        FotoPerfil fotoGuardada = fotoPerfilRepository.save(fotoPerfil);
        return convertirDTO(fotoGuardada);
    }

    public FotoPerfilResponseDTO actualizarFoto(Long id, FotoPerfil fotoActualizada) {
        FotoPerfil foto = fotoPerfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foto de perfil no encontrada"));

        foto.setUrlFotoCloud(fotoActualizada.getUrlFotoCloud());
        foto.setPublicId(fotoActualizada.getPublicId());
        foto.setUsuario(fotoActualizada.getUsuario());

        FotoPerfil fotoGuardada = fotoPerfilRepository.save(foto);

        return convertirDTO(fotoGuardada);
    }

    public void eliminarFoto(Long id) {
        fotoPerfilRepository.deleteById(id);
    }

    private FotoPerfilResponseDTO convertirDTO(FotoPerfil fotoPerfil) {
        FotoPerfilResponseDTO dto = new FotoPerfilResponseDTO();

        dto.setIdFoto(fotoPerfil.getIdFoto());
        dto.setUrlFotoCloud(fotoPerfil.getUrlFotoCloud());
        dto.setPublicId(fotoPerfil.getPublicId());

        if (fotoPerfil.getUsuario() != null) {
            dto.setIdUsuario(fotoPerfil.getUsuario().getIdUsuario());
        }

        return dto;
    }
}