package com.servigo.servigo.servicio.model;

import com.servigo.servigo.usuario.model.Prestador;
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
    private String modalidad;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_prestador")
    private Prestador prestador;

    @ManyToOne
    @JoinColumn(name = "id_especialidad")
    private Especialidad especialidad;
}