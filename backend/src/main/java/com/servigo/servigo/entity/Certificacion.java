package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "CERTIFICACION")
public class Certificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCertificacion;

    private String nombreDocumento;

    private String urlDocumento;

    private String publicId;

    private String estado;

    private LocalDateTime fechaSubida;

    @ManyToOne
    @JoinColumn(name = "id_prestador", nullable = false)
    private Prestador prestador;
}