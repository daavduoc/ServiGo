package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "PRESTADOR")
public class Prestador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPrestador;

    private String tipoPrestador;
    private String descripcion;
    private String experiencia;
    private String direccionLocal;
    private String estadoValidacion;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;
}