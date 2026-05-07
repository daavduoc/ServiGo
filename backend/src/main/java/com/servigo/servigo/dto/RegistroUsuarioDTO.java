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
    private String direccion;
    private String comuna;
    private String region;
    private String tipoUsuario; // CLIENTE o PRESTADOR
    private String tipoPrestador; // individual o empresa, solo si es PRESTADOR
    private Long idEmpresa;

}