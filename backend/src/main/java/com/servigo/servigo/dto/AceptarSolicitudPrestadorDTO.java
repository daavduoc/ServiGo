package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class AceptarSolicitudPrestadorDTO {

    /**
     * Dirección donde se realizará el servicio. Si viene vacía, se usa la del prestador.
     */
    private String direccionAtencion;
}
