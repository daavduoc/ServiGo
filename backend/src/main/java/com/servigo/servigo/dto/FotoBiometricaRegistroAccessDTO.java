package com.servigo.servigo.dto;

import lombok.Data;

@Data
public class FotoBiometricaRegistroAccessDTO {

    private String signedUrl;
    private String publicId;
    private String estado;
}
