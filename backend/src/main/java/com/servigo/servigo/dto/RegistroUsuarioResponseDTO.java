package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class RegistroUsuarioResponseDTO {

    private Long idUsuario;
    private Long idPrestador;
    private String correo;
    private String nombre;
    private String apellido;
}
