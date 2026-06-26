package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Rol;
import com.servigo.servigo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /** Cuenta más reciente si hay correos duplicados (legacy en BD). */
    Optional<Usuario> findFirstByCorreoIgnoreCaseOrderByIdUsuarioDesc(String correo);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCaseAndIdUsuarioNot(String correo, Long idUsuario);

    boolean existsByRut(String rut);

    boolean existsByRutAndIdUsuarioNot(String rut, Long idUsuario);

    static String normalizarCorreo(String correo) {
        if (correo == null) {
            return null;
        }
        return correo.trim().toLowerCase(Locale.ROOT);
    }
    List<Usuario> findByRolAndEstado(Rol rol, String estado);
    List<Usuario> findByRol(Rol rol);
    List<Usuario> findByEstado(String estado);
    long countByEstado(String estado);
}