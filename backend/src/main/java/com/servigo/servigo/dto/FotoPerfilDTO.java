package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class FotoPerfilDTO {

    private Long idUsuario;

    private String urlFotoCloud;

    private String publicId;
}