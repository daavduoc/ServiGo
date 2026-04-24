package com.servigo.servigo.agendamiento.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;

    private LocalDateTime fechaHoraReserva;
    private LocalDateTime fechaCreacionReserva;
    private String estado;

    @OneToOne
    @JoinColumn(name = "id_solicitud")
    private SolicitudServicio solicitud;
}