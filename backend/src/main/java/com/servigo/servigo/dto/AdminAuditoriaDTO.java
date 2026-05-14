package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuditoriaDTO {
    private Long idAuditoria;
    private Long idAdmin;
    private String nombreAdmin;
    private String accion;
    private String tablaAfectada;
    private Long registroId;
    private String valorAnterior;
    private String valorNuevo;
    private LocalDateTime fechaHora;
    private String detalles;
}