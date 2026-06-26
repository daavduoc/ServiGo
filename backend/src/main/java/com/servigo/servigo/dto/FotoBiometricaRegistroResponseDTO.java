package com.servigo.servigo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FotoBiometricaRegistroResponseDTO {

    private Long idFotoBiometrica;
    private Long idUsuario;
    private LocalDateTime fechaRegistro;
    private String estado;
}
