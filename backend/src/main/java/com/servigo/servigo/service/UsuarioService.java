package com.servigo.servigo.service;

import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.RolRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PrestadorRepository prestadorRepository;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            ClienteRepository clienteRepository,
            PrestadorRepository prestadorRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario registrarNuevoUsuario(RegistroUsuarioDTO dto) {

        Long idRol = dto.getTipoUsuario().equalsIgnoreCase("PRESTADOR") ? 2L : 1L;
        Rol rol = rolRepository.findById(idRol).orElse(null);

        Usuario usuario = new Usuario();
        usuario.setRut(dto.getRut());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getContrasena());
        usuario.setTelefono(dto.getTelefono());
        usuario.setEstado("activo");
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);

        // Creación automática según tipo de usuario
        if (dto.getTipoUsuario().equalsIgnoreCase("CLIENTE")) {

            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);
            clienteRepository.save(cliente);

        } else if (dto.getTipoUsuario().equalsIgnoreCase("PRESTADOR")) {

            if (dto.getTipoPrestador() == null) {
                throw new RuntimeException("Debe especificar tipoPrestador: individual o empresa");
            }

            Prestador prestador = new Prestador();
            prestador.setUsuario(usuario);
            prestador.setTipoPrestador(dto.getTipoPrestador());
            prestador.setEstadoValidacion("pendiente");
            prestadorRepository.save(prestador);
        }
        return usuario;
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {

    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setRut(usuarioActualizado.getRut());
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setCorreo(usuarioActualizado.getCorreo());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setEstado(usuarioActualizado.getEstado());
        usuario.setRol(usuarioActualizado.getRol());

    return usuarioRepository.save(usuario);
    }

}