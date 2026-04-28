package com.servigo.servigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.servigo.servigo.entity.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
}