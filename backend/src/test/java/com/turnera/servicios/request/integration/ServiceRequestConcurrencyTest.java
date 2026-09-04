package com.turnera.servicios.request.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.turnera.servicios.request.repository.SolicitudRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@EnabledIfEnvironmentVariable(named = "SUPABASE_JDBC_URL", matches = ".+")
@EnabledIfEnvironmentVariable(named = "SUPABASE_DB_USERNAME", matches = ".+")
@EnabledIfEnvironmentVariable(named = "SUPABASE_DB_PASSWORD", matches = ".+")
class ServiceRequestConcurrencyTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private SolicitudRepository repository;

  @Test
  void rejectsTheSecondClientStaleUpdateAndPreservesTheFirstOne() throws Exception {
    String createdJson =
        mockMvc
            .perform(
                post("/api/solicitudes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"numeroCuenta":"AC-100","nombreTitular":"Ana Perez",
                         "direccion":"Av. Siempre Viva 123","motivoPedido":"Revisi\u00f3n",
                         "operador":"Operador 1"}
                        """))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    JsonNode created = objectMapper.readTree(createdJson);
    long id = created.get("id").asLong();
    int sharedVersion = created.get("version").asInt();

    try {
      mockMvc
          .perform(
              put("/api/solicitudes/{id}", id)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(updateBody("Cambio del primer cliente", sharedVersion)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.version").value(sharedVersion + 1));

      mockMvc
          .perform(
              put("/api/solicitudes/{id}", id)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(updateBody("Cambio obsoleto", sharedVersion)))
          .andExpect(status().isConflict())
          .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"));

      String persistedJson =
          mockMvc
              .perform(get("/api/solicitudes/{id}", id))
              .andExpect(status().isOk())
              .andReturn()
              .getResponse()
              .getContentAsString();
      assertThat(objectMapper.readTree(persistedJson).get("comentariosServicio").asText())
          .isEqualTo("Cambio del primer cliente");
    } finally {
      repository.deleteById(id);
    }
  }

  private String updateBody(String comments, int version) {
    return """
        {"numeroCuenta":"AC-100","nombreTitular":"Ana Perez",
         "direccion":"Av. Siempre Viva 123","motivoPedido":"Revisi\u00f3n",
         "operador":"Operador 1","comentariosServicio":"%s",
         "estado":"EN_PRUEBA","version":%d}
        """
        .formatted(comments, version);
  }
}
