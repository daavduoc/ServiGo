package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class FotoPerfilResponseDTO {

    private Long idFoto;

    private Long idUsuario;

    private String urlFotoCloud;

    private String publicId;
}