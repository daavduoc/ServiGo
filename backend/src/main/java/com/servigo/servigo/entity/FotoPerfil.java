package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "FOTO_PERFIL")
public class FotoPerfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFoto;

    private String urlFotoCloud;
    private String publicId;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
}