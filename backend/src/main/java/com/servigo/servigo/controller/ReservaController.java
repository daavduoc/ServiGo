package com.servigo.servigo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servigo.servigo.dto.ClienteReservasResponseDTO;
import com.servigo.servigo.dto.CrearReservaClienteDTO;
import com.servigo.servigo.entity.Reserva;
import com.servigo.servigo.service.ReservaService;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping("/cliente/mis-reservas")
    public ResponseEntity<?> misReservasCliente(Authentication authentication) {
        try {
            ClienteReservasResponseDTO data = reservaService.listarReservasClienteAutenticado(
                    authentication.getName()
            );
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cliente/agendar")
    public ResponseEntity<?> agendarReservaCliente(
            @RequestBody CrearReservaClienteDTO dto,
            Authentication authentication
    ) {
        try {
            Reserva reserva = reservaService.crearReservaCliente(authentication.getName(), dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Reserva creada correctamente",
                    "idReserva", reserva.getIdReserva()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/cliente/{id}/cancelar")
    public ResponseEntity<?> cancelarReservaCliente(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            reservaService.cancelarReservaCliente(id, authentication.getName());
            return ResponseEntity.ok(Map.of("mensaje", "Reserva cancelada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/cliente/{id}/eliminar")
    public ResponseEntity<?> eliminarReservaCliente(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            reservaService.eliminarReservaCliente(id, authentication.getName());
            return ResponseEntity.ok(Map.of("mensaje", "Reserva eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaService.listarReservas();
    }

    @GetMapping("/{id}")
    public Reserva obtenerReserva(@PathVariable Long id) {
        return reservaService.obtenerReservaPorId(id);
    }

    @PostMapping
    public Reserva crearReserva(@RequestBody Reserva reserva) {
        return reservaService.crearReserva(reserva);
    }

    @PutMapping("/{id}")
    public Reserva actualizarReserva(@PathVariable Long id, @RequestBody Reserva reservaActualizada) {
        return reservaService.actualizarReserva(id, reservaActualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
    }
}
