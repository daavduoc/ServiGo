package com.servigo.servigo.service;

import com.servigo.servigo.dto.PrestadorBusquedaDTO;
import com.servigo.servigo.dto.PrestadorPublicoDetalleDTO;
import com.servigo.servigo.dto.PrestadorPublicoDetalleDTO.DisponibilidadPublicaDTO;
import com.servigo.servigo.dto.PrestadorPublicoDetalleDTO.ServicioPublicoDTO;
import com.servigo.servigo.entity.Disponibilidad;
import com.servigo.servigo.entity.Empresa;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Servicio;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.DisponibilidadRepository;
import com.servigo.servigo.repository.FotoPerfilRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.ServicioRepository;
import com.servigo.servigo.repository.UsuarioRepository;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicioRepository servicioRepository;
    private final FotoPerfilRepository fotoPerfilRepository;
    private final DisponibilidadRepository disponibilidadRepository;

    private static final DateTimeFormatter HORA_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public PrestadorService(
            PrestadorRepository prestadorRepository,
            UsuarioRepository usuarioRepository,
            ServicioRepository servicioRepository,
            FotoPerfilRepository fotoPerfilRepository,
            DisponibilidadRepository disponibilidadRepository
    ) {
        this.prestadorRepository = prestadorRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicioRepository = servicioRepository;
        this.fotoPerfilRepository = fotoPerfilRepository;
        this.disponibilidadRepository = disponibilidadRepository;
    }

    public List<Prestador> listarPrestadores() {
        return prestadorRepository.findAll();
    }

    public PrestadorPublicoDetalleDTO obtenerPrestadorPublicoPorId(Long id) {
        Prestador prestador = prestadorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestador no encontrado"));

        if (!"validado".equalsIgnoreCase(prestador.getEstadoValidacion()) || !esPrestadorVisiblePublicamente(prestador)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestador no disponible");
        }

        PrestadorBusquedaDTO base = convertirABusquedaDTO(prestador);
        PrestadorPublicoDetalleDTO detalle = new PrestadorPublicoDetalleDTO();
        detalle.setIdPrestador(base.getIdPrestador());
        detalle.setNombre(base.getNombre());
        detalle.setProfesion(base.getProfesion());
        detalle.setArea(base.getArea());
        detalle.setPrecio(base.getPrecio());
        detalle.setImagen(base.getImagen());
        detalle.setComuna(base.getComuna());
        detalle.setRegion(base.getRegion());
        detalle.setDescripcion(prestador.getDescripcion());
        detalle.setExperiencia(prestador.getExperiencia());

        List<ServicioPublicoDTO> servicios = servicioRepository.findByPrestadorIdPrestador(id).stream()
                .filter(s -> s.getEstado() == null || "activo".equalsIgnoreCase(s.getEstado()))
                .map(s -> {
                    ServicioPublicoDTO dto = new ServicioPublicoDTO();
                    dto.setIdServicio(s.getIdServicio());
                    dto.setNombre(s.getNombre());
                    dto.setDescripcion(s.getDescripcion());
                    dto.setPrecioReferencial(s.getPrecioReferencial());
                    dto.setModalidad(s.getModalidad());
                    return dto;
                })
                .collect(Collectors.toList());
        detalle.setServicios(servicios);

        List<DisponibilidadPublicaDTO> disponibilidades = disponibilidadRepository.findByPrestadorIdPrestador(id).stream()
                .filter(d -> d.getEstado() == null || "activo".equalsIgnoreCase(d.getEstado()))
                .map(this::convertirDisponibilidadPublica)
                .collect(Collectors.toList());
        detalle.setDisponibilidades(disponibilidades);

        return detalle;
    }

    private DisponibilidadPublicaDTO convertirDisponibilidadPublica(Disponibilidad d) {
        DisponibilidadPublicaDTO dto = new DisponibilidadPublicaDTO();
        dto.setDiaSemana(d.getDiaSemana());
        dto.setHoraInicio(formatearHora(d.getHoraInicio()));
        dto.setHoraFin(formatearHora(d.getHoraFin()));
        if (d.getServicio() != null) {
            dto.setIdServicio(d.getServicio().getIdServicio());
        }
        dto.setFecha(d.getFecha() != null ? d.getFecha().toString() : null);
        dto.setExcluido(d.getExcluido() != null ? d.getExcluido() : false);
        return dto;
    }

    private String formatearHora(LocalTime hora) {
        return hora != null ? hora.format(HORA_FMT) : null;
    }

    public List<PrestadorBusquedaDTO> listarPrestadoresPublicos(String categoria, String query) {
        String termino = query != null ? query.trim().toLowerCase(Locale.ROOT) : "";

        return prestadorRepository.findByEstadoValidacion("validado").stream()
                .filter(this::esPrestadorVisiblePublicamente)
                .filter(p -> coincideCategoria(p, categoria))
                .filter(p -> coincideBusqueda(p, termino))
                .map(this::convertirABusquedaDTO)
                .sorted(Comparator.comparing(PrestadorBusquedaDTO::getNombre, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());
    }

    private boolean esPrestadorVisiblePublicamente(Prestador prestador) {
        Usuario usuario = prestador.getUsuario();
        if (usuario == null) {
            return false;
        }

        String estadoUsuario = usuario.getEstado() != null ? usuario.getEstado().toLowerCase(Locale.ROOT) : "";
        return !"bloqueado".equals(estadoUsuario) && !"inactivo".equals(estadoUsuario);
    }

    private boolean coincideCategoria(Prestador prestador, String categoria) {
        if (categoria == null || categoria.isBlank() || "Todos".equalsIgnoreCase(categoria)) {
            return true;
        }

        if (prestador.getCategoriaPrestador() == null || prestador.getCategoriaPrestador().getNombre() == null) {
            return false;
        }

        return categoria.equalsIgnoreCase(prestador.getCategoriaPrestador().getNombre());
    }

    private boolean coincideBusqueda(Prestador prestador, String termino) {
        if (termino.isEmpty()) {
            return true;
        }

        PrestadorBusquedaDTO dto = convertirABusquedaDTO(prestador);
        return contiene(dto.getNombre(), termino)
                || contiene(dto.getProfesion(), termino)
                || contiene(dto.getArea(), termino)
                || contiene(dto.getComuna(), termino);
    }

    private boolean contiene(String valor, String termino) {
        return valor != null && valor.toLowerCase(Locale.ROOT).contains(termino);
    }

    private PrestadorBusquedaDTO convertirABusquedaDTO(Prestador prestador) {
        PrestadorBusquedaDTO dto = new PrestadorBusquedaDTO();
        Usuario usuario = prestador.getUsuario();

        dto.setIdPrestador(prestador.getIdPrestador());
        dto.setNombre(obtenerNombreVisible(prestador, usuario));
        dto.setProfesion(obtenerProfesion(prestador));
        dto.setArea(
                prestador.getCategoriaPrestador() != null
                        ? prestador.getCategoriaPrestador().getNombre()
                        : "General"
        );
        dto.setPrecio(obtenerPrecioDesde(prestador.getIdPrestador()));
        dto.setComuna(usuario != null ? usuario.getComuna() : null);
        dto.setRegion(usuario != null ? usuario.getRegion() : null);

        if (usuario != null) {
            fotoPerfilRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                    .ifPresent(foto -> dto.setImagen(foto.getUrlFotoCloud()));
        }

        return dto;
    }

    private String obtenerNombreVisible(Prestador prestador, Usuario usuario) {
        if (prestador.getEmpresa() != null) {
            Empresa empresa = prestador.getEmpresa();
            if (empresa.getNombreComercial() != null && !empresa.getNombreComercial().isBlank()) {
                return empresa.getNombreComercial().trim();
            }
            if (empresa.getRazonSocial() != null && !empresa.getRazonSocial().isBlank()) {
                return empresa.getRazonSocial().trim();
            }
        }

        if (usuario == null) {
            return "Prestador ServiGo";
        }

        String nombre = usuario.getNombre() != null ? usuario.getNombre().trim() : "";
        String apellido = usuario.getApellido() != null ? usuario.getApellido().trim() : "";
        if ("-".equals(apellido)) {
            apellido = "";
        }

        String completo = (nombre + (apellido.isEmpty() ? "" : " " + apellido)).trim();
        return completo.isEmpty() ? "Prestador ServiGo" : completo;
    }

    private String obtenerProfesion(Prestador prestador) {
        if (prestador.getEspecialidad() != null && !prestador.getEspecialidad().isBlank()) {
            return prestador.getEspecialidad().trim();
        }

        if (prestador.getCategoriaPrestador() != null && prestador.getCategoriaPrestador().getNombre() != null) {
            return prestador.getCategoriaPrestador().getNombre();
        }

        return "Especialista ServiGo";
    }

    private Double obtenerPrecioDesde(Long idPrestador) {
        return servicioRepository.findByPrestadorIdPrestador(idPrestador).stream()
                .filter(s -> s.getEstado() == null || "activo".equalsIgnoreCase(s.getEstado()))
                .map(Servicio::getPrecioReferencial)
                .filter(Objects::nonNull)
                .min(Double::compareTo)
                .orElse(null);
    }

    public Prestador obtenerPrestadorPorId(Long id) {
        return prestadorRepository.findById(id).orElse(null);
    }

    public Prestador crearPrestador(Prestador prestador) {

        Usuario usuario = usuarioRepository.findById(prestador.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        prestador.setUsuario(usuario);

        return prestadorRepository.save(prestador);
    }

    public Prestador actualizarPrestador(Long id, Prestador prestadorActualizado) {
        Prestador prestador = prestadorRepository.findById(id).orElse(null);

        if (prestador != null) {
            prestador.setTipoPrestador(prestadorActualizado.getTipoPrestador());
            prestador.setDescripcion(prestadorActualizado.getDescripcion());
            prestador.setExperiencia(prestadorActualizado.getExperiencia());
            prestador.setDireccionLocal(prestadorActualizado.getDireccionLocal());
            prestador.setEstadoValidacion(prestadorActualizado.getEstadoValidacion());

            Usuario usuario = usuarioRepository.findById(prestadorActualizado.getUsuario().getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            prestador.setUsuario(usuario);
            prestador.setEmpresa(prestadorActualizado.getEmpresa());

            return prestadorRepository.save(prestador);
        }

        return null;
    }

    public void eliminarPrestador(Long id) {
        prestadorRepository.deleteById(id);
    }

    public List<Prestador> listarPorCategoria(String categoria) {
        return prestadorRepository.findByCategoriaPrestadorNombreIgnoreCase(categoria);
    }
}
