package com.servigo.servigo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VincularFotoRegistroDTO {

    @Email
    @NotBlank
    private String correo;

    @NotBlank
    private String fotoUrl;
}
