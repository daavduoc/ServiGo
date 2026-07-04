package com.servigo.servigo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BloqueoDisponibilidadDTO {

    private Long idBloqueo;
    private Long idServicio;

    private LocalDate fecha;

    private LocalTime horaInicio;
    private LocalTime horaFin;

    private String tipo;
    private String motivo;

    public Long getIdBloqueo() {
        return idBloqueo;
    }

    public void setIdBloqueo(Long idBloqueo) {
        this.idBloqueo = idBloqueo;
    }

    public Long getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(Long idServicio) {
        this.idServicio = idServicio;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}