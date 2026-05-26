package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class CrearReservaClienteDTO {

    private Long idPrestador;
    private Long idServicio;
    /**
     * Fecha en formato ISO yyyy-MM-dd.
     */
    private String fecha;
    /**
     * Hora en formato HH:mm.
     */
    private String hora;
}

