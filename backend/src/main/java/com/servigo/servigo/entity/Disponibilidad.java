package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;

@Data
@Entity
@Table(name = "DISPONIBILIDAD")
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisponibilidad;

    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_prestador")
    private Prestador prestador;
}