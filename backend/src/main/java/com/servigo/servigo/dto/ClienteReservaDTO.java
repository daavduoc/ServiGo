package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class ClienteReservaDTO {

    private Long idReserva;
    private Long idPrestador;
    private String servicio;
    private String especialista;
    private String fechaTexto;
    private String horaTexto;
    private String estado;
    /** success | warning | secondary | danger — para badges Bootstrap */
    private String estadoEtiqueta;
    private String precioTexto;
    /** Mensaje orientado al cliente según el estado de la reserva. */
    private String mensajeDetalle;
}
