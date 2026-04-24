package com.servigo.servigo.biometria.model;

import com.servigo.servigo.agendamiento.model.SolicitudServicio;
import com.servigo.servigo.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "VALIDACION_BIOMETRICA")
public class ValidacionBiometrica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idValidacion;

    private String tipoValidacion;
    private String urlFotoCapturada;
    private Double porcentajeCoincidencia;
    private String resultado;
    private LocalDateTime fechaValidacion;
    private String observacion;

    @ManyToOne
    @JoinColumn(name = "id_solicitud")
    private SolicitudServicio solicitud;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}