package com.servigo.servigo.controller;

import com.servigo.servigo.service.CloudinaryService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map subirImagen(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return cloudinaryService.subirImagen(
                file,
                "servigo"
        );
    }
}