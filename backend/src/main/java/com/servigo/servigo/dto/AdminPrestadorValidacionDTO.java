package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String categoriaPrestador;

    private List<String> especialidadesServicios;

    private String tipoPrestador;
    private String descripcion;
    private String experiencia;
    private String estadoValidacion;
    private String empresa;
    private Integer certificacionesCount;
    private String motivoRechazo;
}