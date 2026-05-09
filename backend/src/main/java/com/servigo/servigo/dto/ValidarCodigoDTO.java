package com.servigo.servigo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidarCodigoDTO {

    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;
}