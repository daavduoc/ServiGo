package com.servigo.servigo;

import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.entity.CategoriaPrestador;
import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.CategoriaPrestadorRepository;
import com.servigo.servigo.repository.ClienteRepository;
import com.servigo.servigo.repository.EmpresaRepository;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.repository.RolRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.service.UsuarioService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


public class UsuarioServiceTest {

    private UsuarioRepository usuarioRepository;

    private RolRepository rolRepository;

    private ClienteRepository clienteRepository;

    private PrestadorRepository prestadorRepository;

    private EmpresaRepository empresaRepository;

    private CategoriaPrestadorRepository categoriaPrestadorRepository;

    private PasswordEncoder passwordEncoder;

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {

        usuarioRepository = Mockito.mock(UsuarioRepository.class);

        rolRepository = Mockito.mock(RolRepository.class);

        clienteRepository = Mockito.mock(ClienteRepository.class);

        prestadorRepository = Mockito.mock(PrestadorRepository.class);

        empresaRepository = Mockito.mock(EmpresaRepository.class);

        categoriaPrestadorRepository =
                Mockito.mock(CategoriaPrestadorRepository.class);

        passwordEncoder = new BCryptPasswordEncoder();

        usuarioService = new UsuarioService(
                usuarioRepository,
                rolRepository,
                clienteRepository,
                prestadorRepository,
                empresaRepository,
                categoriaPrestadorRepository,
                passwordEncoder,
                Mockito.mock(com.servigo.servigo.service.FotoPerfilService.class)
        );
    }

    @Test
    void registrarClienteDebeGuardarUsuario() {

        RegistroUsuarioDTO dto = new RegistroUsuarioDTO();

        dto.setRut("12345678-9");

        dto.setNombre("Carlos");

        dto.setApellido("Perez");

        dto.setCorreo("cliente@test.com");

        dto.setContrasena("Clave123");

        dto.setTelefono("912345678");

        dto.setTipoUsuario("CLIENTE");

        Rol rol = new Rol();

        rol.setNombre("CLIENTE");

        when(rolRepository.findByNombre("CLIENTE"))
                .thenReturn(Optional.of(rol));

        Usuario usuarioGuardado = new Usuario();

        usuarioGuardado.setCorreo(dto.getCorreo());

        when(usuarioRepository.save(Mockito.any(Usuario.class)))
                .thenReturn(usuarioGuardado);

        Usuario resultado =
                usuarioService.registrarNuevoUsuario(dto);

        assertNotNull(resultado);

        assertEquals(
                "cliente@test.com",
                resultado.getCorreo()
        );
    }

    @Test
    void tipoUsuarioInvalidoDebeLanzarError() {

        RegistroUsuarioDTO dto = new RegistroUsuarioDTO();

        dto.setTipoUsuario("OTRO");

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> usuarioService.registrarNuevoUsuario(dto)
        );

        assertEquals(
                "tipoUsuario debe ser CLIENTE o PRESTADOR",
                exception.getMessage()
        );
    }


    @Test
    void registrarPrestadorParticularDebeGuardarUsuario() {

        RegistroUsuarioDTO dto = new RegistroUsuarioDTO();

        dto.setRut("22222222-2");
        dto.setNombre("Ana");
        dto.setApellido("Rojas");
        dto.setCorreo("prestador@test.com");
        dto.setContrasena("Clave123");
        dto.setTelefono("912345678");
        dto.setTipoUsuario("PRESTADOR");
        dto.setTipoPrestador("particular");
        dto.setIdCategoria(1L);

        Rol rol = new Rol();
        rol.setNombre("PRESTADOR");

        when(rolRepository.findByNombre("PRESTADOR"))
                .thenReturn(Optional.of(rol));

        CategoriaPrestador categoria = new CategoriaPrestador();
        categoria.setIdCategoria(1L);
        categoria.setNombre("tecnico");

        when(categoriaPrestadorRepository.findById(1L))
                .thenReturn(Optional.of(categoria));

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setCorreo(dto.getCorreo());

        when(usuarioRepository.save(Mockito.any(Usuario.class)))
                .thenReturn(usuarioGuardado);

        Usuario resultado = usuarioService.registrarNuevoUsuario(dto);

        assertNotNull(resultado);
        assertEquals("prestador@test.com", resultado.getCorreo());
    }

    @Test
    void registrarPrestadorSinCategoriaDebeLanzarError() {

        RegistroUsuarioDTO dto = new RegistroUsuarioDTO();

        dto.setRut("33333333-3");
        dto.setNombre("Pedro");
        dto.setApellido("Soto");
        dto.setCorreo("pedro@test.com");
        dto.setContrasena("Clave123");
        dto.setTelefono("912345678");
        dto.setTipoUsuario("PRESTADOR");
        dto.setTipoPrestador("particular");
        dto.setIdCategoria(null);

        Rol rol = new Rol();
        rol.setNombre("PRESTADOR");

        when(rolRepository.findByNombre("PRESTADOR"))
                .thenReturn(Optional.of(rol));

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setCorreo(dto.getCorreo());

        when(usuarioRepository.save(Mockito.any(Usuario.class)))
                .thenReturn(usuarioGuardado);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> usuarioService.registrarNuevoUsuario(dto)
        );

        assertEquals(
                "Debe indicar idCategoria para el prestador",
                exception.getMessage()
        );
    }
}