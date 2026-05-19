package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class PerfilUsuarioDTO {

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

    private String tipoPrestador;
    private String categoriaPrestador;
    private String nombreEmpresa;
    private String direccionLocal;
    private String descripcion;
    private String experiencia;
    private String estadoValidacion;

    private String urlFotoCloud;
}