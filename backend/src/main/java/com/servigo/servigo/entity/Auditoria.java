package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "AUDITORIA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auditoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAuditoria;
    
    @Column(name = "id_admin", nullable = false)
    private Long idAdmin;
    
    @Column(name = "accion", nullable = false, length = 50)
    private String accion;
    
    @Column(name = "tabla_afectada", nullable = false, length = 100)
    private String tablaAfectada;
    
    @Column(name = "registro_id", nullable = false)
    private Long registroId;
    
    @Column(name = "valor_anterior", columnDefinition = "LONGTEXT")
    private String valorAnterior;
    
    @Column(name = "valor_nuevo", columnDefinition = "LONGTEXT")
    private String valorNuevo;
    
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;
    
    @Column(name = "detalles", columnDefinition = "VARCHAR(500)")
    private String detalles;
}