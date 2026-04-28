package com.servigo.servigo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.repository.ServicioRepository;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id).orElse(null);
    }

    public Servicio crearServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public Servicio actualizarServicio(Long id, Servicio servicioActualizado) {
        Servicio servicio = servicioRepository.findById(id).orElse(null);
        
        if (servicio != null && servicioActualizado != null) {
            servicio.setNombre(servicioActualizado.getNombre());
            servicio.setDescripcion(servicioActualizado.getDescripcion());
            servicio.setPrecioReferencial(servicioActualizado.getPrecioReferencial());
            servicio.setModalidad(servicioActualizado.getModalidad());
            servicio.setEstado(servicioActualizado.getEstado());
            return servicioRepository.save(servicio);
        }
        
        return null;
    }

    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }
}