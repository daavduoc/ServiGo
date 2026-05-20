package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {
    private Long totalUsuarios;
    private Long totalPrestadores;
    private Long totalClientes;
    private Long solicitudesPendientes;
    private Long solicitudesAprobadas;
    private Long solicitudesRechazadas;
    private Long reservasConfirmadas;
    private Long reservasFinalizadas;
    private Double promedioCalificacion; // Promedio de reseñas
    private Long prestadoresValidados;
    private Long prestadoresPendientes;
    private Long usuariosActivos;
    private Long usuariosBloqueados;
    private Long usuariosInactivos;
}