package com.servigo.servigo.dto;

import lombok.Data;

import java.time.LocalDate;

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
    private LocalDate fechaNacimiento;
    private String estado;
    private String rol;

    private Long idPrestador;
    private String tipoPrestador;
    private String categoriaPrestador;
    private String nombreEmpresa;
    private String razonSocialEmpresa;
    private String rutEmpresa;
    private String giroComercial;
    private String estadoEmpresa;
    private String direccionLocal;
    private String descripcion;
    private String experiencia;
    private String estadoValidacion;
    private String especialidad;

    private String urlFotoCloud;
}