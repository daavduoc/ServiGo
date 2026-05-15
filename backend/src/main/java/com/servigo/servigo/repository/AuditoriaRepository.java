package com.servigo.servigo.repository;

import com.servigo.servigo.entity.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    
    List<Auditoria> findByIdAdminOrderByFechaHoraDesc(Long idAdmin);
    
    List<Auditoria> findByTablaAfectadaOrderByFechaHoraDesc(String tablaAfectada);
    
    List<Auditoria> findByRegistroIdOrderByFechaHoraDesc(Long registroId);
    
    List<Auditoria> findByAccionOrderByFechaHoraDesc(String accion);
    
    @Query("SELECT a FROM Auditoria a WHERE a.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fechaHora DESC")
    List<Auditoria> findByFechaHoraBetween(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                          @Param("fechaFin") LocalDateTime fechaFin);
}