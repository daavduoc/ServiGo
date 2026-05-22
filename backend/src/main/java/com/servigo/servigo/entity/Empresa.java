package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "EMPRESA")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private Long idEmpresa;

    @Column(name = "rut_empresa", nullable = false, unique = true, length = 20)
    private String rutEmpresa;

    @Column(name = "razon_social", nullable = false, length = 150)
    private String razonSocial;

    /** Nombre de fantasía o nombre comercial visible. */
    @Column(name = "nombre_comercial", length = 150)
    private String nombreComercial;

    @Column(name = "giro_comercial", nullable = false, length = 100)
    private String giroComercial;

    private String direccion;
    private String telefono;
    private String correo;

    private String comuna;
    private String region;

    private Double latitud;
    private Double longitud;

    @Column(nullable = false, length = 20)
    private String estado = "pendiente_revision";
}
