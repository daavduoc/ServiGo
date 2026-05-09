package com.servigo.servigo.config;

import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.repository.RolRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminDataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminDataLoader(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @Override
    public void run(String... args) {

        if (usuarioRepository.findByCorreo(adminEmail).isPresent()) {
            return;
        }

        Rol rolAdmin = rolRepository.findById(3L)
                .orElseThrow(() -> new RuntimeException("Rol ADMIN no existe"));

        Usuario admin = new Usuario();
        admin.setRut("11111111-1");
        admin.setNombre("Administrador");
        admin.setApellido("ServiGo");
        admin.setCorreo(adminEmail);
        admin.setContrasena(adminPassword);
        admin.setTelefono("999999999");
        admin.setEstado("activo");
        admin.setCorreoValidado(true);
        admin.setRol(rolAdmin);

        usuarioRepository.save(admin);

        System.out.println("ADMIN CREADO");
    }
}