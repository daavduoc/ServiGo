package com.servigo.servigo.service;

import com.servigo.servigo.dto.CambiarPasswordPerfilDTO;
import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.dto.UsuarioResponseDTO;
import com.servigo.servigo.entity.CategoriaPrestador;
import com.servigo.servigo.entity.Cliente;
import com.servigo.servigo.entity.Empresa;
import com.servigo.servigo.entity.Prestador;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.CategoriaPrestadorRepository;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.EmpresaRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.RolRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PrestadorRepository prestadorRepository;
    private final EmpresaRepository empresaRepository;
    private final CategoriaPrestadorRepository categoriaPrestadorRepository;
    private final PasswordEncoder passwordEncoder;
    private final FotoPerfilService fotoPerfilService;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            ClienteRepository clienteRepository,
            PrestadorRepository prestadorRepository,
            EmpresaRepository empresaRepository,
            CategoriaPrestadorRepository categoriaPrestadorRepository,
            PasswordEncoder passwordEncoder,
            FotoPerfilService fotoPerfilService,
            EmailService emailService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
        this.empresaRepository = empresaRepository;
        this.categoriaPrestadorRepository = categoriaPrestadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.fotoPerfilService = fotoPerfilService;
        this.emailService = emailService;
    }

        public List<UsuarioResponseDTO> listarUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getIdUsuario(),
                        usuario.getRut(),
                        usuario.getNombre(),
                        usuario.getApellido(),
                        usuario.getCorreo(),
                        usuario.getTelefono(),
                        usuario.getDireccion(),
                        usuario.getComuna(),
                        usuario.getRegion(),
                        usuario.getLatitud(),
                        usuario.getLongitud(),
                        usuario.getEstado(),
                        usuario.getRol().getNombre()
                ))
                .toList();
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

        if (!("PRESTADOR".equals(tipoUsuario)
                && "empresa".equalsIgnoreCase(dto.getTipoPrestador()))
                && (dto.getApellido() == null || dto.getApellido().isBlank())) {

            throw new RuntimeException("El apellido es obligatorio");
        }

        if ("PRESTADOR".equals(tipoUsuario)
                && "empresa".equalsIgnoreCase(dto.getTipoPrestador())) {

            usuario.setApellido("-");

        } else {

            usuario.setApellido(dto.getApellido());
        }
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setTelefono(dto.getTelefono());
        usuario.setDireccion(dto.getDireccion());
        usuario.setComuna(dto.getComuna());
        usuario.setRegion(dto.getRegion());
        usuario.setLatitud(dto.getLatitud());
        usuario.setLongitud(dto.getLongitud());
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

            if (dto.getIdCategoria() == null) {
                throw new RuntimeException("Debe indicar idCategoria para el prestador");
            }

            if (dto.getTipoPrestador().equalsIgnoreCase("empresa") && dto.getIdEmpresa() == null) {
                throw new RuntimeException("Debe indicar idEmpresa para prestador tipo empresa");
            }

            CategoriaPrestador categoria = categoriaPrestadorRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría de prestador no encontrada"));

            Prestador prestador = new Prestador();
            prestador.setUsuario(usuario);
            prestador.setTipoPrestador(dto.getTipoPrestador());
            prestador.setCategoriaPrestador(categoria);
            prestador.setEstadoValidacion("pendiente");
            prestador.setDireccionLocal(dto.getDireccionLocal());

            if (dto.getTipoPrestador().equalsIgnoreCase("empresa")
                && dto.getDireccionLocal() == null) {

            throw new RuntimeException(
                    "Prestador empresa debe tener direccionLocal"
            );
            }

            if (dto.getIdEmpresa() != null) {
                Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                        .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

                prestador.setEmpresa(empresa);
            }

            prestadorRepository.save(prestador);
        }

        String codigoVerificacion = String.valueOf(100000 + secureRandom.nextInt(900000));
        usuario.setCodigoRecuperacion(codigoVerificacion);
        usuario.setCodigoExpiracion(LocalDateTime.now().plusHours(24));
        usuarioRepository.save(usuario);

        emailService.enviarCodigoVerificacion(usuario.getCorreo(), codigoVerificacion);

        String fotoUrl = dto.getFotoUrl();
        if (fotoUrl != null && !fotoUrl.isBlank()) {
            fotoPerfilService.guardarFotoDesdeUrl(usuario.getIdUsuario(), fotoUrl.trim());
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
        usuario.setLatitud(usuarioActualizado.getLatitud());
        usuario.setLongitud(usuarioActualizado.getLongitud());
        usuario.setEstado(usuarioActualizado.getEstado());
        usuario.setRol(usuarioActualizado.getRol());

        return usuarioRepository.save(usuario);
    }

    public String cambiarPasswordPerfil(
        String correo,
        CambiarPasswordPerfilDTO dto
    ) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getContrasena())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setContrasena(passwordEncoder.encode(dto.getPasswordNueva()));

        usuarioRepository.save(usuario);

        return "Contraseña actualizada correctamente";
    }
}