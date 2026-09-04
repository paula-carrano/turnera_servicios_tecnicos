package com.turnera.servicios.request.contract;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turnera.servicios.request.controller.ServiceRequestController;
import com.turnera.servicios.request.dto.ErrorResponse;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.service.ServiceRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ServiceRequestController.class)
class ServiceRequestCollectionContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestService service;

    @Test
    void createsRequestWithServiceRequestResponseAndServerValues() throws Exception {
        ServiceRequestResponse response = new ServiceRequestResponse(
                15L,
                0,
                "123456",
                "Juan Perez",
                "Av. Siempre Viva 123",
                "Falla en el servicio",
                "operador01",
                LocalDate.of(2026, 9, 10),
                LocalTime.of(9, 0),
                LocalTime.of(12, 0),
                "El cliente informa una interrupción.",
                RequestStatus.PENDIENTE);
        when(service.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/solicitudes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "numeroCuenta": "123456",
                                  "nombreTitular": "Juan Perez",
                                  "direccion": "Av. Siempre Viva 123",
                                  "motivoPedido": "Falla en el servicio",
                                  "operador": "operador01",
                                  "fechaVisita": "2026-09-10",
                                  "horaDesde": "09:00:00",
                                  "horaHasta": "12:00:00",
                                  "comentariosServicio": "El cliente informa una interrupción."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(15))
                .andExpect(jsonPath("$.version").value(0))
                .andExpect(jsonPath("$.numeroCuenta").value("123456"))
                .andExpect(jsonPath("$.fechaVisita").value("2026-09-10"))
                .andExpect(jsonPath("$.horaDesde").value("09:00:00"))
                .andExpect(jsonPath("$.horaHasta").value("12:00:00"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }

    @Test
    void rejectsInvalidRequestWithErrorResponse() throws Exception {
        ErrorResponse response = new ErrorResponse(
                "VALIDATION_ERROR", "Los datos enviados no son válidos.",
                java.util.Map.of("nombreTitular", "no debe estar vacío"));
        when(service.create(any())).thenThrow(new IllegalArgumentException(response.message()));

        mockMvc.perform(post("/api/solicitudes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "numeroCuenta": "123456",
                                  "nombreTitular": "",
                                  "direccion": "Av. Siempre Viva 123",
                                  "motivoPedido": "Falla en el servicio",
                                  "operador": "operador01"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.fields").exists());
    }
}
