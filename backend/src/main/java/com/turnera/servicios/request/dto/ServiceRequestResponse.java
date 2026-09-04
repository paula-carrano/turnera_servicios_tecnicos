package com.turnera.servicios.request.dto;

import com.turnera.servicios.request.entity.RequestStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record ServiceRequestResponse(
        Long id,
        Integer version,
        String numeroCuenta,
        String nombreTitular,
        String direccion,
        String motivoPedido,
        String operador,
        LocalDate fechaVisita,
        LocalTime horaDesde,
        LocalTime horaHasta,
        String comentariosServicio,
        RequestStatus estado) {
}
