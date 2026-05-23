package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class PrestadorTrabajoDTO {

    private Long idSolicitud;
    private String clienteNombre;
    private String servicioNombre;
    private String descripcion;
    private String direccionAtencion;
    private String fechaPreferida;
    private String estado;
}
