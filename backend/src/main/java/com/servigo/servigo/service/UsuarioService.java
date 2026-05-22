package com.servigo.servigo.service;

import com.servigo.servigo.dto.CambiarPasswordPerfilDTO;
import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.dto.RegistroUsuarioResponseDTO;
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
import org.springframework.transaction.annotation.Transactional;

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
        validarRutDisponible(usuario.getRut(), null);
        validarCorreoDisponible(usuario.getCorreo(), null);
        usuario.setCorreo(UsuarioRepository.normalizarCorreo(usuario.getCorreo()));
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public RegistroUsuarioResponseDTO registrarNuevoUsuario(RegistroUsuarioDTO dto) {

        String tipoUsuario = dto.getTipoUsuario().toUpperCase();

        if (!tipoUsuario.equals("CLIENTE") && !tipoUsuario.equals("PRESTADOR")) {
            throw new RuntimeException("tipoUsuario debe ser CLIENTE o PRESTADOR");
        }

        Rol rol = rolRepository.findByNombre(tipoUsuario)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + tipoUsuario));

        boolean esPrestadorEmpresa = "PRESTADOR".equals(tipoUsuario)
                && dto.getTipoPrestador() != null
                && "empresa".equalsIgnoreCase(dto.getTipoPrestador());

        validarRutDisponible(dto.getRut(), null);
        validarCorreoDisponible(dto.getCorreo(), null);

        Usuario usuario = new Usuario();
        usuario.setRut(dto.getRut().trim());
        usuario.setNombre(dto.getNombre());

        if (!esPrestadorEmpresa && (dto.getApellido() == null || dto.getApellido().isBlank())) {
            throw new RuntimeException("El apellido es obligatorio");
        }

        usuario.setApellido(esPrestadorEmpresa ? "-" : dto.getApellido());
        usuario.setCorreo(UsuarioRepository.normalizarCorreo(dto.getCorreo()));
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setTelefono(dto.getTelefono());
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setDireccion(dto.getDireccion());
        usuario.setComuna(dto.getComuna());
        usuario.setRegion(dto.getRegion());
        usuario.setLatitud(dto.getLatitud());
        usuario.setLongitud(dto.getLongitud());
        usuario.setEstado("activo");
        usuario.setCorreoValidado(false);
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);

        Long idPrestador = null;

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

            if (!esPrestadorEmpresa && dto.getFechaNacimiento() == null) {
                throw new RuntimeException("La fecha de nacimiento es obligatoria para prestadores particulares");
            }

            CategoriaPrestador categoria = categoriaPrestadorRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría de prestador no encontrada"));

            Prestador prestador = new Prestador();
            prestador.setUsuario(usuario);
            prestador.setTipoPrestador(dto.getTipoPrestador());
            prestador.setCategoriaPrestador(categoria);
            prestador.setEstadoValidacion("pendiente");
            if (dto.getEspecialidad() != null && !dto.getEspecialidad().isBlank()) {
                prestador.setEspecialidad(dto.getEspecialidad().trim());
            }
            prestador.setDireccionLocal(
                    dto.getDireccionLocal() != null && !dto.getDireccionLocal().isBlank()
                            ? dto.getDireccionLocal()
                            : dto.getDireccion()
            );

            if (esPrestadorEmpresa) {
                Empresa empresa = crearEmpresaDesdeRegistro(dto);
                prestador.setEmpresa(empresa);
            } else if (dto.getIdEmpresa() != null) {
                Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                        .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
                prestador.setEmpresa(empresa);
            }

            prestador = prestadorRepository.save(prestador);
            idPrestador = prestador.getIdPrestador();
        }

        String codigoVerificacion = String.valueOf(100000 + secureRandom.nextInt(900000));
        usuario.setCodigoRecuperacion(codigoVerificacion);
        usuario.setCodigoExpiracion(LocalDateTime.now().plusHours(24));
        usuarioRepository.save(usuario);

        emailService.enviarCodigoVerificacionAsync(usuario.getCorreo(), codigoVerificacion);

        String fotoUrl = dto.getFotoUrl();
        if (fotoUrl != null && !fotoUrl.isBlank()) {
            fotoPerfilService.guardarFotoDesdeUrl(usuario.getIdUsuario(), fotoUrl.trim());
        }

        RegistroUsuarioResponseDTO response = new RegistroUsuarioResponseDTO();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setIdPrestador(idPrestador);
        response.setCorreo(usuario.getCorreo());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());

        return response;
    }

    private Empresa crearEmpresaDesdeRegistro(RegistroUsuarioDTO dto) {

        String rutEmpresa = dto.getRutEmpresa() != null && !dto.getRutEmpresa().isBlank()
                ? dto.getRutEmpresa().trim()
                : dto.getRut();

        if (rutEmpresa == null || rutEmpresa.isBlank()) {
            throw new RuntimeException("El RUT de la empresa es obligatorio");
        }

        if (empresaRepository.findByRutEmpresa(rutEmpresa).isPresent()) {
            throw new RuntimeException("Ya existe una empresa registrada con ese RUT");
        }

        String razonSocial = dto.getRazonSocial() != null && !dto.getRazonSocial().isBlank()
                ? dto.getRazonSocial().trim()
                : dto.getNombre();

        if (razonSocial == null || razonSocial.isBlank()) {
            throw new RuntimeException("La razón social es obligatoria");
        }

        if (dto.getGiroComercial() == null || dto.getGiroComercial().isBlank()) {
            throw new RuntimeException("El giro comercial es obligatorio");
        }

        Empresa empresa = new Empresa();
        empresa.setRutEmpresa(rutEmpresa);
        empresa.setRazonSocial(razonSocial);
        empresa.setNombreComercial(
                dto.getNombreFantasia() != null && !dto.getNombreFantasia().isBlank()
                        ? dto.getNombreFantasia().trim()
                        : razonSocial
        );
        empresa.setGiroComercial(dto.getGiroComercial().trim());
        empresa.setCorreo(UsuarioRepository.normalizarCorreo(dto.getCorreo()));
        empresa.setTelefono(dto.getTelefono());
        empresa.setDireccion(dto.getDireccion());
        empresa.setComuna(dto.getComuna());
        empresa.setRegion(dto.getRegion());
        empresa.setLatitud(dto.getLatitud());
        empresa.setLongitud(dto.getLongitud());
        empresa.setEstado("pendiente_revision");

        return empresaRepository.save(empresa);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActualizado.getRut() != null
                && !usuarioActualizado.getRut().trim().equals(usuario.getRut())) {
            validarRutDisponible(usuarioActualizado.getRut(), id);
            usuario.setRut(usuarioActualizado.getRut().trim());
        }

        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());

        if (usuarioActualizado.getCorreo() != null && !usuarioActualizado.getCorreo().isBlank()) {
            String correoNormalizado = UsuarioRepository.normalizarCorreo(usuarioActualizado.getCorreo());
            if (!correoNormalizado.equals(usuario.getCorreo())) {
                validarCorreoDisponible(correoNormalizado, id);
                usuario.setCorreo(correoNormalizado);
            }
        }

        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
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
        Usuario usuario = usuarioRepository
                .findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(UsuarioRepository.normalizarCorreo(correo))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getContrasena())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setContrasena(passwordEncoder.encode(dto.getPasswordNueva()));

        usuarioRepository.save(usuario);

        return "Contraseña actualizada correctamente";
    }

    private void validarCorreoDisponible(String correo, Long idUsuarioExcluido) {
        String normalizado = UsuarioRepository.normalizarCorreo(correo);
        if (normalizado == null || normalizado.isBlank()) {
            throw new RuntimeException("El correo electrónico es obligatorio");
        }

        boolean ocupado = idUsuarioExcluido == null
                ? usuarioRepository.existsByCorreoIgnoreCase(normalizado)
                : usuarioRepository.existsByCorreoIgnoreCaseAndIdUsuarioNot(normalizado, idUsuarioExcluido);

        if (ocupado) {
            throw new RuntimeException("Ya existe una cuenta registrada con este correo electrónico");
        }
    }

    private void validarRutDisponible(String rut, Long idUsuarioExcluido) {
        if (rut == null || rut.isBlank()) {
            throw new RuntimeException("El RUT es obligatorio");
        }

        String rutNormalizado = rut.trim();
        boolean ocupado = idUsuarioExcluido == null
                ? usuarioRepository.existsByRut(rutNormalizado)
                : usuarioRepository.existsByRutAndIdUsuarioNot(rutNormalizado, idUsuarioExcluido);

        if (ocupado) {
            throw new RuntimeException("Ya existe una cuenta registrada con este RUT");
        }
    }
}
