package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReporteDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long totalSolicitudes;
    private Long solicitudesAprobadas;
    private Long solicitudesRechazadas;
    private Long solicitudesCanceladas;
    private Long totalReservas;
    private Long reservasFinalizadas;
    private Long reservasCanceladas;
    private BigDecimal ingresoEstimado;
    private Long nuevosUsuarios;
    private Long nuevosPrestadores;
    private Long nuevosClientes;
    private Double promedioCalificacionesReseñas;
    private Long totalReseñas;
    private String especialidadMasUtilizada;
    private Integer solicitudesPorEspecialidad;
    private Long prestadoresValidados;
    private Long prestadoresPendientes;
    private Long prestadoresRechazados;
}