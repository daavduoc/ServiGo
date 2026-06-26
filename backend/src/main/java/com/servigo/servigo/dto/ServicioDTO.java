package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class ServicioDTO {

    private Long idPrestador;

    private Long idEspecialidad;

    private String nombre;

    private String descripcion;

    private Double precioReferencial;

    private String modalidad;
}