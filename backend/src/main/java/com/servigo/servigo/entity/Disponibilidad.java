package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Getter
@Setter
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

    private LocalDate fecha;
    private Boolean excluido;

    @ManyToOne
    @JoinColumn(name = "id_prestador")
    private Prestador prestador;

    @ManyToOne
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;
}