package com.servigo.servigo.servicio.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ESPECIALIDAD")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEspecialidad;

    private String nombre;
}