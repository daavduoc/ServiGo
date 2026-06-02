package com.servigo.servigo.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PrestadorPublicoDetalleDTO {

    private Long idPrestador;
    private String nombre;
    private String profesion;
    private String area;
    private Double precio;
    private String imagen;
    private String comuna;
    private String region;
    private String descripcion;
    private String experiencia;
    private List<ServicioPublicoDTO> servicios = new ArrayList<>();
    private List<DisponibilidadPublicaDTO> disponibilidades = new ArrayList<>();

    @Data
    public static class DisponibilidadPublicaDTO {
        private String diaSemana;
        private String horaInicio;
        private String horaFin;
        private Long idServicio;
        private String fecha;
        private Boolean excluido;
    }

    @Data
    public static class ServicioPublicoDTO {
        private Long idServicio;
        private String nombre;
        private String descripcion;
        private Double precioReferencial;
        private String modalidad;
    }
}
