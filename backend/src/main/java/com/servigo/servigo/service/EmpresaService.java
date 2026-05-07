package com.servigo.servigo.service;

import com.servigo.servigo.entity.Empresa;
import com.servigo.servigo.repository.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public List<Empresa> listarEmpresas() {
        return empresaRepository.findAll();
    }

    public Empresa obtenerEmpresaPorId(Long id) {
        return empresaRepository.findById(id).orElse(null);
    }

    public Empresa crearEmpresa(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public Empresa actualizarEmpresa(Long id, Empresa empresaActualizada) {
        Empresa empresa = empresaRepository.findById(id).orElse(null);

        if (empresa != null) {
            empresa.setNombreComercial(empresaActualizada.getNombreComercial());
            empresa.setDireccion(empresaActualizada.getDireccion());
            empresa.setTelefono(empresaActualizada.getTelefono());
            empresa.setCorreo(empresaActualizada.getCorreo());
            empresa.setEstado(empresaActualizada.getEstado());

            return empresaRepository.save(empresa);
        }

        return null;
    }

    public void eliminarEmpresa(Long id) {
        empresaRepository.deleteById(id);
    }
}