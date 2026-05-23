package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class PrestadorBusquedaDTO {

    private Long idPrestador;
    private String nombre;
    private String profesion;
    private String area;
    private Double precio;
    private String imagen;
    private String comuna;
    private String region;
}
