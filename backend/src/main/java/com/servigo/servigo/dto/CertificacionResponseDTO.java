package com.servigo.servigo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CertificacionResponseDTO {

    private Long idCertificacion;

    private Long idPrestador;

    private String nombreDocumento;

    private String urlDocumento;

    private String publicId;

    private String estado;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime fechaSubida;
}