package com.servigo.servigo.service;

import com.servigo.servigo.entity.FotoPerfil;
import com.servigo.servigo.repository.FotoPerfilRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FotoPerfilService {

    private final FotoPerfilRepository fotoPerfilRepository;

    public FotoPerfilService(FotoPerfilRepository fotoPerfilRepository) {
        this.fotoPerfilRepository = fotoPerfilRepository;
    }

    public List<FotoPerfil> listarFotos() {
        return fotoPerfilRepository.findAll();
    }

    public FotoPerfil obtenerFotoPorId(Long id) {
        return fotoPerfilRepository.findById(id).orElse(null);
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