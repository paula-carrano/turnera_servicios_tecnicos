package com.turnera.servicios.request.contract;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.turnera.servicios.request.controller.ServiceRequestController;
import com.turnera.servicios.request.exception.RequestVersionConflictException;
import com.turnera.servicios.request.service.ServiceRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ServiceRequestController.class)
class ServiceRequestConflictContractTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ServiceRequestService service;

  @Test
  void mapsExplicitStaleVersionToConflictErrorResponse() throws Exception {
    when(service.update(eq(15L), any())).thenThrow(new RequestVersionConflictException("stale"));

    performValidUpdate()
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"))
        .andExpect(jsonPath("$.message").value("La solicitud fue modificada por otra persona."));
  }

  @Test
  void mapsSpringOptimisticLockFailureToSameConflictResponse() throws Exception {
    when(service.update(eq(15L), any()))
        .thenThrow(new OptimisticLockingFailureException("concurrent update"));

    performValidUpdate()
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"))
        .andExpect(jsonPath("$.message").isNotEmpty());
  }

  private org.springframework.test.web.servlet.ResultActions performValidUpdate() throws Exception {
    return mockMvc.perform(
        put("/api/solicitudes/15")
            .contentType(MediaType.APPLICATION_JSON)
            .content(
                """
                {"numeroCuenta":"123456","nombreTitular":"Juan Perez",
                 "direccion":"Av. Siempre Viva 123","motivoPedido":"Revisi\u00f3n",
                 "operador":"operador01","estado":"EN_PRUEBA","version":0}
                """));
  }
}
