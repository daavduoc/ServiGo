package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
     // Ocultar la contraseña en las respuestas JSON
    @JsonIgnore  
    private String contrasena;

    private String telefono;
    private String direccion;
    private String comuna;
    private String region;
    private String estado;
    private Boolean correoValidado;
    private String codigoRecuperacion;
    private LocalDateTime codigoExpiracion;
        
    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;
}