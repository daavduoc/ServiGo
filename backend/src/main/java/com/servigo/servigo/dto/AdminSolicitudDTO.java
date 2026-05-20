package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSolicitudDTO {
    private Long idSolicitud;
    private Long idCliente;
    private String nombreCliente;
    private String emailCliente;
    private Long idServicio;
    private String nombreServicio;
    private Long idPrestador;
    private String nombrePrestador;
    private String especialidad;
    private LocalDateTime fechaHoraSolicitud;
    private LocalDateTime fechaHoraPreferida;
    private String direccionAtencion;
    private String estado;
    private String observacion;
    private Boolean validacionBiometricaCompletada;
}