package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(unique = true, nullable = false)
    private String rut;

    private String nombre;
    private String apellido;
    private String correo;

    @JsonIgnore
    private String contrasena;

    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String direccion;
    private String comuna;
    private String region;

    // GEOLOCALIZACION
    private Double latitud;
    private Double longitud;

    private String estado;

    private Boolean correoValidado;

    @JsonIgnore
    private String codigoRecuperacion;
    @JsonIgnore
    private LocalDateTime codigoExpiracion;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    @Column(name = "fecha_registro", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "ultima_actividad")
    private LocalDateTime ultimaActividad;
}