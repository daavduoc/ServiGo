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
    private String fechaSolicitudTexto;
    private String estado;
    /** success | warning | secondary | danger — para badges Bootstrap */
    private String estadoEtiqueta;
    private String precioTexto;
    /** Mensaje orientado al cliente según el estado de la reserva. */
    private String mensajeDetalle;
    /** Indica si la reserva puede ser eliminada (completada o cancelada) */
    private Boolean puedeEliminar;
    /** Indica si la reserva está pendiente de realizarse */
    private Boolean puedeRealizar;
}
