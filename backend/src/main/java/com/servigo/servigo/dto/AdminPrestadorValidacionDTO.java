package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPrestadorValidacionDTO {

    private Long idPrestador;
    private Long idUsuario;
    private String nombrePrestador;
    private String email;
    private String telefono;
    private String rut;

    private String categoriaPrestador;
    private String especialidad;
    private List<String> especialidadesServicios;

    private String tipoPrestador;
    private String descripcion;
    private String experiencia;
    private String estadoValidacion;

    private String direccion;
    private String comuna;
    private String region;
    private String direccionLocal;
    private LocalDate fechaNacimiento;
    private LocalDateTime fechaRegistro;
    private Boolean correoValidado;
    private String urlFotoPerfil;

    private String empresa;
    private String nombreComercial;
    private String rutEmpresa;
    private String giroComercial;
    private String estadoEmpresa;

    private Integer certificacionesCount;
    private String motivoRechazo;
}
