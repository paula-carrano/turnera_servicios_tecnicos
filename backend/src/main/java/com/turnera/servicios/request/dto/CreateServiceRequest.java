package com.turnera.servicios.request.dto;

import com.turnera.servicios.request.entity.RequestStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateServiceRequest(
        @NotBlank String numeroCuenta,
        @NotBlank String nombreTitular,
        @NotBlank String direccion,
        @NotBlank String motivoPedido,
        @NotBlank String operador,
        LocalDate fechaVisita,
        LocalTime horaDesde,
        LocalTime horaHasta,
        String comentariosServicio,
        RequestStatus estado) {

    public CreateServiceRequest {
        estado = estado == null ? RequestStatus.PENDIENTE : estado;
    }
}
