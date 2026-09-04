package com.turnera.servicios.request.contract;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.turnera.servicios.request.controller.ServiceRequestController;
import com.turnera.servicios.request.exception.RequestNotFoundException;
import com.turnera.servicios.request.service.ServiceRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ServiceRequestController.class)
class ServiceRequestValidationContractTest {

  @Autowired private MockMvc mockMvc;
  @MockBean private ServiceRequestService service;

  @Test
  void rejectsInvalidUpdateWithErrorResponse() throws Exception {
    mockMvc
        .perform(
            put("/api/solicitudes/15")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {"numeroCuenta":"","nombreTitular":"Juan Perez","direccion":"Direcci\u00f3n",
                                 "motivoPedido":"Revisi\u00f3n","operador":"operador01","version":-1}
                                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
        .andExpect(jsonPath("$.message").isNotEmpty())
        .andExpect(jsonPath("$.fields.numeroCuenta").exists())
        .andExpect(jsonPath("$.fields.version").exists());
  }

  @Test
  void rejectsMalformedDateTimeAndStatusValues() throws Exception {
    mockMvc
        .perform(
            put("/api/solicitudes/15")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {"numeroCuenta":"123","nombreTitular":"Juan","direccion":"Direcci\u00f3n",
                                 "motivoPedido":"Revisi\u00f3n","operador":"operador01",
                                 "fechaVisita":"fecha-invalida","estado":"DESCONOCIDO","version":0}
                                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
  }

  @Test
  void returnsNotFoundErrorResponseForMissingRequest() throws Exception {
    when(service.findById(999L))
        .thenThrow(new RequestNotFoundException("No se encontr\u00f3 la solicitud 999."));

    mockMvc
        .perform(get("/api/solicitudes/999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("NOT_FOUND"))
        .andExpect(jsonPath("$.message").isNotEmpty());
  }

  @Test
  void returnsNotFoundErrorResponseWhenUpdatingMissingRequest() throws Exception {
    when(service.update(eq(999L), any()))
        .thenThrow(new RequestNotFoundException("No se encontr\u00f3 la solicitud 999."));

    mockMvc
        .perform(
            put("/api/solicitudes/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {"numeroCuenta":"123","nombreTitular":"Juan","direccion":"Direcci\u00f3n",
                                 "motivoPedido":"Revisi\u00f3n","operador":"operador01","version":0}
                                """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("NOT_FOUND"));
  }
}
