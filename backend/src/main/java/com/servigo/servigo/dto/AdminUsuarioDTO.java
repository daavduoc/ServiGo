package com.servigo.servigo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUsuarioDTO {

    private Long idUsuario;
    private String rut;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String rol;
    private String estado;
    private String region;
    private String comuna;
    private Boolean correoValidado;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaActividad;
}