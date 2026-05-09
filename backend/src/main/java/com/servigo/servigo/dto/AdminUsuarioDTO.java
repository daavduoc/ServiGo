package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class AdminUsuarioDTO {

    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    private String estado;
}