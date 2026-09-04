package com.turnera.servicios.request.contract;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.turnera.servicios.request.controller.ServiceRequestController;
import com.turnera.servicios.request.service.ServiceRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ServiceRequestController.class)
class ServiceRequestErrorContractTest {

  private static final String SENSITIVE_DETAIL = "password=secret database-host=internal";
  private static final String VALID_CREATE =
      """
      {"numeroCuenta":"123","nombreTitular":"Ana","direccion":"Dirección",
       "motivoPedido":"Revisión","operador":"operador01"}
      """;
  private static final String VALID_UPDATE =
      """
      {"numeroCuenta":"123","nombreTitular":"Ana","direccion":"Dirección",
       "motivoPedido":"Revisión","operador":"operador01","version":0}
      """;

  @Autowired private MockMvc mockMvc;
  @MockBean private ServiceRequestService service;

  @Test
  void hidesUnexpectedFailureDetailsForCollectionGet() throws Exception {
    when(service.findAll()).thenThrow(new RuntimeException(SENSITIVE_DETAIL));

    assertInternalError(mockMvc.perform(get("/api/solicitudes")));
  }

  @Test
  void hidesUnexpectedFailureDetailsForCreate() throws Exception {
    when(service.create(any())).thenThrow(new RuntimeException(SENSITIVE_DETAIL));

    assertInternalError(
        mockMvc.perform(
            post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_CREATE)));
  }

  @Test
  void hidesUnexpectedFailureDetailsForItemGet() throws Exception {
    when(service.findById(15L)).thenThrow(new RuntimeException(SENSITIVE_DETAIL));

    assertInternalError(mockMvc.perform(get("/api/solicitudes/15")));
  }

  @Test
  void hidesUnexpectedFailureDetailsForUpdate() throws Exception {
    when(service.update(eq(15L), any())).thenThrow(new RuntimeException(SENSITIVE_DETAIL));

    assertInternalError(
        mockMvc.perform(
            put("/api/solicitudes/15")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_UPDATE)));
  }

  private void assertInternalError(org.springframework.test.web.servlet.ResultActions result)
      throws Exception {
    result
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
        .andExpect(jsonPath("$.message").value("Ocurrió un error interno."))
        .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(SENSITIVE_DETAIL))))
        .andExpect(jsonPath("$.fields").doesNotExist());
  }
}
