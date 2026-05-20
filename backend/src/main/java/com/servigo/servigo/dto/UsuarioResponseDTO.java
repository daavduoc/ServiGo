package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


// Este DTO se utiliza para enviar la información del usuario al frontend, sin incluir el password ni otros datos sensibles como contraseña,codigoRecuperacion, codigoExpiracion

@Data
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long idUsuario;
    private String rut;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String direccion;
    private String comuna;
    private String region;
    private Double latitud;
    private Double longitud;
    private String estado;
    private String rol;
}