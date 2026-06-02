package com.servigo.servigo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map subirImagen(MultipartFile file, String carpeta) throws IOException {

        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", carpeta,
                        "resource_type", "image",
                        "quality", "auto:good",
                        "fetch_format", "auto"
                )
        );
    }

    public Map subirImagenPrivada(MultipartFile file, String carpeta) throws IOException {
        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", carpeta,
                        "resource_type", "image",
                        "type", "private",
                        "access_mode", "authenticated",
                        "quality", "auto:good",
                        "fetch_format", "auto"
                )
        );
    }

    public String generarUrlFirmada(String publicId, int segundosExpiracion) {
        return cloudinary.url()
                .resourceType("image")
                .type("private")
                .signed(true)
                .format("jpg")
                .transformation(new Transformation().quality("auto:good"))
                .generate(publicId);
    }

    /** Imágenes y PDF (certificados, patentes, etc.). */
    public Map subirDocumento(MultipartFile file, String carpeta) throws IOException {

        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", carpeta,
                        "resource_type", "auto"
                )
        );
    }

    public void eliminarImagen(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}