package com.servigo.servigo.service;

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

    public List<FotoPerfil> listarFotos() {
        return fotoPerfilRepository.findAll();
    }

    public FotoPerfil obtenerFotoPorId(Long id) {
        return fotoPerfilRepository.findById(id).orElse(null);
    }

    public FotoPerfil subirFotoPerfil(Long idUsuario, MultipartFile file) throws IOException {

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

            return fotoPerfilRepository.save(fotoExistente);
        }

        FotoPerfil fotoPerfil = new FotoPerfil();
        fotoPerfil.setUsuario(usuario);
        fotoPerfil.setUrlFotoCloud(url);
        fotoPerfil.setPublicId(publicId);

        return fotoPerfilRepository.save(fotoPerfil);
    }

    public FotoPerfil crearFoto(FotoPerfil fotoPerfil) {
        return fotoPerfilRepository.save(fotoPerfil);
    }

    public FotoPerfil actualizarFoto(Long id, FotoPerfil fotoActualizada) {
        FotoPerfil foto = fotoPerfilRepository.findById(id).orElse(null);

        if (foto != null) {
            foto.setUrlFotoCloud(fotoActualizada.getUrlFotoCloud());
            foto.setPublicId(fotoActualizada.getPublicId());
            foto.setUsuario(fotoActualizada.getUsuario());

            return fotoPerfilRepository.save(foto);
        }

        return null;
    }

    public void eliminarFoto(Long id) {
        fotoPerfilRepository.deleteById(id);
    }
}