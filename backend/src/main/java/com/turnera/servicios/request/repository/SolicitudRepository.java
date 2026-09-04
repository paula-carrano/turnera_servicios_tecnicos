package com.turnera.servicios.request.repository;

import com.turnera.servicios.request.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
}
