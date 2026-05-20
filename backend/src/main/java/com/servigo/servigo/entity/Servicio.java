package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "SERVICIO")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;

    private String nombre;

    private String descripcion;

    private Double precioReferencial;

    private String modalidad; // domicilio o establecimiento

    private String estado; // activo o inactivo

    @ManyToOne
    @JoinColumn(name = "id_prestador", nullable = false)
    private Prestador prestador;

    @ManyToOne
    @JoinColumn(name = "id_especialidad", nullable = false)
    private Especialidad especialidad;
}