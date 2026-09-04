package com.turnera.servicios.request.unit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.dto.UpdateServiceRequest;
import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.entity.Solicitud;
import com.turnera.servicios.request.exception.RequestValidationException;
import com.turnera.servicios.request.mapper.ServiceRequestMapper;
import com.turnera.servicios.request.repository.SolicitudRepository;
import com.turnera.servicios.request.service.ServiceRequestService;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ServiceRequestUpdateValidationTest {

  @Mock private SolicitudRepository repository;

  private ServiceRequestService service;

  @BeforeEach
  void setUp() {
    service = new ServiceRequestService(repository, new ServiceRequestMapper());
  }

  @Test
  void updatesDateTimesOptionalFieldsAndStatus() throws Exception {
    Solicitud solicitud = existingRequest();
    UpdateServiceRequest request =
        request(
            LocalDate.of(2026, 10, 2),
            LocalTime.of(8, 30),
            LocalTime.of(11, 0),
            RequestStatus.EN_PRUEBA);
    when(repository.findById(8L)).thenReturn(Optional.of(solicitud));
    when(repository.saveAndFlush(solicitud)).thenReturn(solicitud);

    ServiceRequestResponse updated = service.update(8L, request);

    assertThat(updated.fechaVisita()).isEqualTo(LocalDate.of(2026, 10, 2));
    assertThat(updated.horaDesde()).isEqualTo(LocalTime.of(8, 30));
    assertThat(updated.horaHasta()).isEqualTo(LocalTime.of(11, 0));
    assertThat(updated.estado()).isEqualTo(RequestStatus.EN_PRUEBA);
  }

  @Test
  void acceptsEmptyOptionalPlanningFields() throws Exception {
    Solicitud solicitud = existingRequest();
    UpdateServiceRequest request = request(null, null, null, RequestStatus.FINALIZADO);
    when(repository.findById(8L)).thenReturn(Optional.of(solicitud));
    when(repository.saveAndFlush(solicitud)).thenReturn(solicitud);

    ServiceRequestResponse updated = service.update(8L, request);

    assertThat(updated.fechaVisita()).isNull();
    assertThat(updated.horaDesde()).isNull();
    assertThat(updated.horaHasta()).isNull();
    assertThat(updated.estado()).isEqualTo(RequestStatus.FINALIZADO);
  }

  @Test
  void rejectsEndTimeThatIsNotLaterWithoutMutatingTheEntity() throws Exception {
    Solicitud solicitud = existingRequest();
    UpdateServiceRequest request =
        request(
            LocalDate.of(2026, 10, 2),
            LocalTime.of(11, 0),
            LocalTime.of(11, 0),
            RequestStatus.EN_PRUEBA);

    assertThatThrownBy(() -> service.update(8L, request))
        .isInstanceOf(RequestValidationException.class)
        .hasMessageContaining("horaHasta");
    assertThat(solicitud.getEstado()).isEqualTo(RequestStatus.PENDIENTE);
    verify(repository, never()).saveAndFlush(solicitud);
  }

  private UpdateServiceRequest request(
      LocalDate fecha, LocalTime desde, LocalTime hasta, RequestStatus estado) {
    return new UpdateServiceRequest(
        "123456",
        "Juan Perez",
        "Av. Siempre Viva 123",
        "Revisi\u00f3n",
        "operador01",
        fecha,
        desde,
        hasta,
        "Visita coordinada",
        estado,
        2);
  }

  private Solicitud existingRequest() throws Exception {
    Solicitud solicitud = new Solicitud();
    solicitud.setNumeroCuenta("123456");
    solicitud.setNombreTitular("Juan Perez");
    solicitud.setDireccion("Av. Siempre Viva 123");
    solicitud.setMotivoPedido("Falla");
    solicitud.setOperador("operador01");
    solicitud.setEstado(RequestStatus.PENDIENTE);
    setField(solicitud, "id", 8L);
    setField(solicitud, "version", 2);
    return solicitud;
  }

  private void setField(Solicitud solicitud, String name, Object value) throws Exception {
    Field field = Solicitud.class.getDeclaredField(name);
    field.setAccessible(true);
    field.set(solicitud, value);
  }
}
