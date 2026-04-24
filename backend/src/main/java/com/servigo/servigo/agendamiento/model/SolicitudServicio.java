package com.servigo.servigo.agendamiento.model;

import com.servigo.servigo.usuario.model.Cliente;
import com.servigo.servigo.servicio.model.Servicio;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "SOLICITUD_SERVICIO")
public class SolicitudServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSolicitud;

    private LocalDateTime fechaHoraSolicitud;
    private LocalDateTime fechaHoraPreferida;
    private String direccionAtencion;
    private String estado;
    private String observacion;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;
}