package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminMensajeSoporteDTO {

    private Long idMensaje;
    private Long idUsuario;
    private String nombreRemitente;
    private String correoRemitente;
    private String rolRemitente;
    private String tipoProblema;
    private String asunto;
    private String descripcion;
    private String estado;
    private String respuesta;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
