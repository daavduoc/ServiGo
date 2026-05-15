package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);
    List<Usuario> findByRolAndEstado(Rol rol, String estado);
    List<Usuario> findByRol(Rol rol);
    List<Usuario> findByEstado(String estado);
    long countByEstado(String estado);
}