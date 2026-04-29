package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "ESPECIALIDAD")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEspecialidad;

    private String nombre;
    private String descripcion;
}