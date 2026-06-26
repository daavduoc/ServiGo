package com.servigo.servigo.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ClienteReservasResponseDTO {

    private List<ClienteReservaDTO> proximas = new ArrayList<>();
    private List<ClienteReservaDTO> historial = new ArrayList<>();
}
