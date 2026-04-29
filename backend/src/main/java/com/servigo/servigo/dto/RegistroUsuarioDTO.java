package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class RegistroUsuarioDTO {

    private String rut;
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String telefono;
    private String tipo; // CLIENTE o PRESTADOR
}