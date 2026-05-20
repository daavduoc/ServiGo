package com.servigo.servigo.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroUsuarioDTO {

    @NotBlank(message = "El rut es obligatorio")
    private String rut;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String apellido;

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 20, message = "La contraseña debe tener entre 8 y 20 caracteres")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$",
            message = "La contraseña debe tener mayúscula, minúscula y número"
    )
    private String contrasena;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    private String direccion;
    private String comuna;
    private String region;

    // GEOLOCALIZACION
    private Double latitud;
    private Double longitud;
    
    @NotBlank(message = "Debe indicar tipo de usuario")
    private String tipoUsuario;

    // particular o empresa
    private String tipoPrestador;

    // tecnico o profesional
    private Long idCategoria;

    private Long idEmpresa;
    private String direccionLocal;

    /** URL de Cloudinary tras subir la foto en el frontend (opcional). */
    @JsonProperty("fotoUrl")
    @JsonAlias({ "foto_url", "urlFotoCloud", "urlFoto" })
    private String fotoUrl;
}