package com.servigo.servigo.controller;

import com.servigo.servigo.entity.Empresa;
import com.servigo.servigo.service.EmpresaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para gestionar empresas
@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // GET: listar empresas
    // URL: http://localhost:8080/empresas
    @GetMapping
    public List<Empresa> listarEmpresas() {
        return empresaService.listarEmpresas();
    }

    // GET: obtener empresa por ID
    // URL: http://localhost:8080/empresas/{id}
    @GetMapping("/{id}")
    public Empresa obtenerEmpresa(@PathVariable Long id) {
        return empresaService.obtenerEmpresaPorId(id);
    }

    // POST: crear empresa
    // URL: http://localhost:8080/empresas
    @PostMapping
    public Empresa crearEmpresa(@RequestBody Empresa empresa) {
        return empresaService.crearEmpresa(empresa);
    }

    // PUT: actualizar empresa
    // URL: http://localhost:8080/empresas/{id}
    @PutMapping("/{id}")
    public Empresa actualizarEmpresa(@PathVariable Long id, @RequestBody Empresa empresaActualizada) {
        return empresaService.actualizarEmpresa(id, empresaActualizada);
    }

    // DELETE: eliminar empresa
    // URL: http://localhost:8080/empresas/{id}
    @DeleteMapping("/{id}")
    public void eliminarEmpresa(@PathVariable Long id) {
        empresaService.eliminarEmpresa(id);
    }
}