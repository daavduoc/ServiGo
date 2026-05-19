package com.servigo.servigo.controller;

import com.servigo.servigo.dto.PerfilUsuarioDTO;
import com.servigo.servigo.dto.RegistroUsuarioDTO;
import com.servigo.servigo.dto.VincularFotoRegistroDTO;
import com.servigo.servigo.dto.UsuarioResponseDTO;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.FotoPerfilRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.service.FotoPerfilService;
import com.servigo.servigo.service.UsuarioService;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.servigo.servigo.repository.PrestadorRepository;
import com.servigo.servigo.dto.CambiarPasswordPerfilDTO;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final FotoPerfilService fotoPerfilService;
    private final UsuarioRepository usuarioRepository;
    private final PrestadorRepository prestadorRepository;
    private final FotoPerfilRepository fotoPerfilRepository;

    public UsuarioController(
            UsuarioService usuarioService,
            FotoPerfilService fotoPerfilService,
            UsuarioRepository usuarioRepository,
            PrestadorRepository prestadorRepository,
            FotoPerfilRepository fotoPerfilRepository
    ) {
        this.usuarioService = usuarioService;
        this.fotoPerfilService = fotoPerfilService;
        this.usuarioRepository = usuarioRepository;
        this.prestadorRepository = prestadorRepository;
        this.fotoPerfilRepository = fotoPerfilRepository;
    }

    // GET: listar todos los usuarios
    // URL: http://localhost:8080/usuarios
    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // GET: obtener usuario por ID
    // URL: http://localhost:8080/usuarios/{id}
    @GetMapping("/{id}")
    public Usuario obtenerUsuario(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id);
    }

    // GET: obtener perfil del usuario autenticado
    // URL: http://localhost:8080/usuarios/me
    @GetMapping("/me")
    public Usuario obtenerMiPerfil(Authentication authentication) {

        String correo = authentication.getName();

        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // POST: crear usuario básico
    // URL: http://localhost:8080/usuarios
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    // POST: registro completo
    // URL: http://localhost:8080/usuarios/registro
    @PostMapping("/registro")
    public Usuario registrar(@Valid @RequestBody RegistroUsuarioDTO dto) {
        return usuarioService.registrarNuevoUsuario(dto);
    }

    // POST: vincular foto ya subida a Cloudinary tras el registro JSON
    // URL: http://localhost:8080/usuarios/registro/vincular-foto
    @PostMapping("/registro/vincular-foto")
    public void vincularFotoPostRegistro(@Valid @RequestBody VincularFotoRegistroDTO dto) {
        Usuario usuario = usuarioRepository.findByCorreo(dto.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        fotoPerfilService.guardarFotoDesdeUrl(usuario.getIdUsuario(), dto.getFotoUrl());
    }

    // POST: registro con foto
    // URL: http://localhost:8080/usuarios/registro-con-foto
    @PostMapping(
            value = "/registro-con-foto",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Usuario registrarConFoto(
            @RequestParam("rut") String rut,
            @RequestParam("nombre") String nombre,
            @RequestParam("apellido") String apellido,
            @RequestParam("correo") String correo,
            @RequestParam("contrasena") String contrasena,
            @RequestParam("telefono") String telefono,
            @RequestParam(value = "direccion", required = false) String direccion,
            @RequestParam(value = "comuna", required = false) String comuna,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "latitud", required = false) Double latitud,
            @RequestParam(value = "longitud", required = false) Double longitud,
            @RequestParam("tipoUsuario") String tipoUsuario,
            @RequestParam(value = "tipoPrestador", required = false) String tipoPrestador,
            @RequestParam(value = "idCategoria", required = false) Long idCategoria,
            @RequestParam(value = "idEmpresa", required = false) Long idEmpresa,
            @RequestParam(value = "direccionLocal", required = false) String direccionLocal,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        RegistroUsuarioDTO dto = new RegistroUsuarioDTO();

        dto.setRut(rut);
        dto.setNombre(nombre);
        dto.setApellido(apellido);
        dto.setCorreo(correo);
        dto.setContrasena(contrasena);
        dto.setTelefono(telefono);
        dto.setDireccion(direccion);
        dto.setComuna(comuna);
        dto.setRegion(region);
        dto.setLatitud(latitud);
        dto.setLongitud(longitud);
        dto.setTipoUsuario(tipoUsuario);
        dto.setTipoPrestador(tipoPrestador);
        dto.setIdCategoria(idCategoria);
        dto.setIdEmpresa(idEmpresa);
        dto.setDireccionLocal(direccionLocal);

        Usuario usuario = usuarioService.registrarNuevoUsuario(dto);

        if (file != null && !file.isEmpty()) {
            fotoPerfilService.subirFotoPerfil(
                    usuario.getIdUsuario(),
                    file
            );
        }

        return usuario;
    }

    // PUT: actualizar usuario
    // URL: http://localhost:8080/usuarios/{id}
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuarioActualizado
    ) {
        return usuarioService.actualizarUsuario(id, usuarioActualizado);
    }

    // DELETE: eliminar usuario
    // URL: http://localhost:8080/usuarios/{id}
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
    }

    // Mi Perfil,Mi Cuenta , Datos Personales, Configuración de Cuenta
    // GET: obtener perfil completo del usuario autenticado
    // URL: http://localhost:8080/usuarios/me/perfil
    @GetMapping("/me/perfil")
    public PerfilUsuarioDTO obtenerMiPerfilCompleto(Authentication authentication) {

        String correo = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PerfilUsuarioDTO dto = new PerfilUsuarioDTO();

        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setRut(usuario.getRut());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setDireccion(usuario.getDireccion());
        dto.setComuna(usuario.getComuna());
        dto.setRegion(usuario.getRegion());
        dto.setLatitud(usuario.getLatitud());
        dto.setLongitud(usuario.getLongitud());
        dto.setEstado(usuario.getEstado());
        dto.setRol(usuario.getRol().getNombre());

        prestadorRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                .ifPresent(prestador -> {

                    dto.setTipoPrestador(prestador.getTipoPrestador());

                    if (prestador.getCategoriaPrestador() != null) {
                        dto.setCategoriaPrestador(
                                prestador.getCategoriaPrestador().getNombre()
                        );
                    }

                    if (prestador.getEmpresa() != null) {
                        dto.setNombreEmpresa(
                                prestador.getEmpresa().getNombreComercial()
                        );
                    }

                    dto.setDireccionLocal(prestador.getDireccionLocal());
                    dto.setDescripcion(prestador.getDescripcion());
                    dto.setExperiencia(prestador.getExperiencia());
                    dto.setEstadoValidacion(prestador.getEstadoValidacion());
                });

        fotoPerfilRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                .ifPresent(foto -> dto.setUrlFotoCloud(foto.getUrlFotoCloud()));

        return dto;
    }


    
    // PUT: cambiar contraseña del usuario autenticado
    // URL: http://localhost:8080/usuarios/me/password

    @PutMapping("/me/password")
    public String cambiarMiPassword(
            Authentication authentication,
            @Valid @RequestBody CambiarPasswordPerfilDTO dto
    ) {
        String correo = authentication.getName();

        return usuarioService.cambiarPasswordPerfil(correo, dto);
    }
}