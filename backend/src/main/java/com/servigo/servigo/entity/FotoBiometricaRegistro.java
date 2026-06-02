package com.servigo.servigo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "FOTO_BIOMETRICA_REGISTRO")
public class FotoBiometricaRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFotoBiometrica;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "url_foto_cloud", nullable = false, length = 500)
    private String urlFotoCloud;

    @Column(name = "public_id", nullable = false, length = 255)
    private String publicId;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "activa";
        }
    }

    public void bloquear() {
        estado = "bloqueada";
    }
}
