package com.servigo.servigo.service;

import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Empresa;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;

import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.EmpresaRepository;
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
    private final EmpresaRepository empresaRepository;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            ClienteRepository clienteRepository,
            PrestadorRepository prestadorRepository,
            EmpresaRepository empresaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
        this.empresaRepository = empresaRepository;
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

        usuario.setDireccion(dto.getDireccion());
        usuario.setComuna(dto.getComuna());
        usuario.setRegion(dto.getRegion());

        usuario.setEstado("activo");
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);

        // CLIENTE
        if (dto.getTipoUsuario().equalsIgnoreCase("CLIENTE")) {

            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);

            clienteRepository.save(cliente);

        }

        // PRESTADOR
        else if (dto.getTipoUsuario().equalsIgnoreCase("PRESTADOR")) {

            if (dto.getTipoPrestador() == null) {
                throw new RuntimeException("Debe especificar tipoPrestador");
            }

            Prestador prestador = new Prestador();

            prestador.setUsuario(usuario);
            prestador.setTipoPrestador(dto.getTipoPrestador());
            prestador.setEstadoValidacion("pendiente");

            // EMPRESA
            if (dto.getIdEmpresa() != null) {

                Empresa empresa = empresaRepository
                        .findById(dto.getIdEmpresa())
                        .orElse(null);

                prestador.setEmpresa(empresa);
            }

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

        usuario.setDireccion(usuarioActualizado.getDireccion());
        usuario.setComuna(usuarioActualizado.getComuna());
        usuario.setRegion(usuarioActualizado.getRegion());

        usuario.setEstado(usuarioActualizado.getEstado());
        usuario.setRol(usuarioActualizado.getRol());

        return usuarioRepository.save(usuario);
    }
}