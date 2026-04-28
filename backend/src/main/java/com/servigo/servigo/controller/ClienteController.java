package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.service.ClienteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Indica que esta clase es un controlador REST (API)
@RestController

// Define la ruta base: http://localhost:8080/clientes
@RequestMapping("/clientes")
public class ClienteController {

    // Inyección del servicio (donde está la lógica)
    private final ClienteService clienteService;

    // Constructor (Spring inyecta automáticamente el service)
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // GET: Obtener todos los clientes
    // URL: http://localhost:8080/clientes
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }
    // GET: Obtener cliente por ID
    // URL: http://localhost:8080/clientes/1
    @GetMapping("/{id}")
    public Cliente obtenerCliente(@PathVariable Long id) {
        return clienteService.obtenerClientePorId(id);
    }

    // POST: Crear un nuevo cliente
    // URL: http://localhost:8080/clientes
    // Recibe JSON en el body
    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.crearCliente(cliente);
    }

    // DELETE: Eliminar cliente por ID
    // URL: http://localhost:8080/clientes/1
    @DeleteMapping("/{id}")
    public void eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
    }

    @PutMapping("/{id}")
    public Cliente actualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteActualizado) {

    // Buscamos el cliente existente en la BD
    Cliente cliente = clienteService.obtenerClientePorId(id);

    if (cliente != null) {
        // Actualizamos los datos
        cliente.setUsuario(clienteActualizado.getUsuario());
        

        // Guardamos cambios
        return clienteService.crearCliente(cliente);
    }

    // Si no existe, retorna null
    return null;
    }
}