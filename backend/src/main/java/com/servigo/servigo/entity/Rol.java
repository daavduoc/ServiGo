package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ROL")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRol;

    private String nombre;
}