package com.turnera.servicios.request.contract;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.turnera.servicios.request.controller.ServiceRequestController;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.service.ServiceRequestService;
import java.time.LocalDate;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ServiceRequestController.class)
class ServiceRequestItemContractTest {

  @Autowired private MockMvc mockMvc;
  @MockBean private ServiceRequestService service;

  @Test
  void getsRequestByLongId() throws Exception {
    when(service.findById(15L)).thenReturn(response());

    mockMvc
        .perform(get("/api/solicitudes/15"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(15))
        .andExpect(jsonPath("$.version").value(3))
        .andExpect(jsonPath("$.estado").value("EN_PRUEBA"));
  }

  @Test
  void updatesRequestAndReturnsAllContractFields() throws Exception {
    when(service.update(eq(15L), any())).thenReturn(response());

    mockMvc
        .perform(
            put("/api/solicitudes/15")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {"numeroCuenta":"123456","nombreTitular":"Juan Perez",
                                 "direccion":"Av. Siempre Viva 123","motivoPedido":"Revisi\u00f3n",
                                 "operador":"operador01","fechaVisita":"2026-10-02",
                                 "horaDesde":"08:30:00","horaHasta":"11:00:00",
                                 "comentariosServicio":"Visita coordinada","estado":"EN_PRUEBA","version":2}
                                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(15))
        .andExpect(jsonPath("$.version").value(3))
        .andExpect(jsonPath("$.fechaVisita").value("2026-10-02"))
        .andExpect(jsonPath("$.horaDesde").value("08:30:00"))
        .andExpect(jsonPath("$.horaHasta").value("11:00:00"))
        .andExpect(jsonPath("$.comentariosServicio").value("Visita coordinada"))
        .andExpect(jsonPath("$.estado").value("EN_PRUEBA"));
  }

  private ServiceRequestResponse response() {
    return new ServiceRequestResponse(
        15L,
        3,
        "123456",
        "Juan Perez",
        "Av. Siempre Viva 123",
        "Revisi\u00f3n",
        "operador01",
        LocalDate.of(2026, 10, 2),
        LocalTime.of(8, 30),
        LocalTime.of(11, 0),
        "Visita coordinada",
        RequestStatus.EN_PRUEBA);
  }
}
