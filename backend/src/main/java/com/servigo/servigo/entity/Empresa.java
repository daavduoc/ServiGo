package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "EMPRESA")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpresa;

    private String nombreComercial;
    private String direccion;
    private String telefono;
    private String correo;
    private String estado;
}