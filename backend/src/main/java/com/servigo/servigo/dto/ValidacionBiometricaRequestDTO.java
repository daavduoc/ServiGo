package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class ValidacionBiometricaRequestDTO {

    private Long idSolicitud;
    private Long idUsuario;
    private String tipoValidacion; // cliente_pre_envio o prestador_pre_reserva
}