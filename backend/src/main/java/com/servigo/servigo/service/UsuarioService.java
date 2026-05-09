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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PrestadorRepository prestadorRepository;
    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            ClienteRepository clienteRepository,
            PrestadorRepository prestadorRepository,
            EmpresaRepository empresaRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario crearUsuario(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario registrarNuevoUsuario(RegistroUsuarioDTO dto) {

        String tipoUsuario = dto.getTipoUsuario().toUpperCase();

        if (!tipoUsuario.equals("CLIENTE") && !tipoUsuario.equals("PRESTADOR")) {
            throw new RuntimeException("tipoUsuario debe ser CLIENTE o PRESTADOR");
        }

        Rol rol = rolRepository.findByNombre(tipoUsuario)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + tipoUsuario));

        Usuario usuario = new Usuario();

        usuario.setRut(dto.getRut());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setTelefono(dto.getTelefono());
        usuario.setDireccion(dto.getDireccion());
        usuario.setComuna(dto.getComuna());
        usuario.setRegion(dto.getRegion());
        usuario.setEstado("activo");
        usuario.setCorreoValidado(false);
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);

        if (tipoUsuario.equals("CLIENTE")) {

            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);
            clienteRepository.save(cliente);

        } else if (tipoUsuario.equals("PRESTADOR")) {

            if (dto.getTipoPrestador() == null) {
                throw new RuntimeException("Debe especificar tipoPrestador");
            }

            if (dto.getTipoPrestador().equalsIgnoreCase("empresa") && dto.getIdEmpresa() == null) {
                throw new RuntimeException("Debe indicar idEmpresa para prestador tipo empresa");
            }

            Prestador prestador = new Prestador();
            prestador.setUsuario(usuario);
            prestador.setTipoPrestador(dto.getTipoPrestador());
            prestador.setEstadoValidacion("pendiente");

            if (dto.getIdEmpresa() != null) {
                Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                        .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

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