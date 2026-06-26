package com.servigo.servigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearMensajeSoporteDTO {

    private String tipoProblema;
    private String asunto;
    private String descripcion;
}
