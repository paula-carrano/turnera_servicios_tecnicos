package com.turnera.servicios.request.unit;

import com.turnera.servicios.request.dto.CreateServiceRequest;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.service.ServiceRequestService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ServiceRequestCreationTest {

    @Mock
    private ServiceRequestService service;

    @InjectMocks
    private ServiceRequestCreationTestSubject subject;

    @Test
    void createsRequestWithRequiredOptionalAndServerManagedValues() {
        CreateServiceRequest request = new CreateServiceRequest(
                "123456",
                "Juan Perez",
                "Av. Siempre Viva 123",
                "Falla en el servicio",
                "operador01",
                LocalDate.of(2026, 9, 10),
                LocalTime.of(9, 0),
                LocalTime.of(12, 0),
                "El cliente informa una interrupción.",
                null);
        ServiceRequestResponse response = new ServiceRequestResponse(
                1L,
                0,
                request.numeroCuenta(),
                request.nombreTitular(),
                request.direccion(),
                request.motivoPedido(),
                request.operador(),
                request.fechaVisita(),
                request.horaDesde(),
                request.horaHasta(),
                request.comentariosServicio(),
                RequestStatus.PENDIENTE);
        when(service.create(request)).thenReturn(response);

        ServiceRequestResponse created = subject.create(request);

        assertThat(created.id()).isPositive();
        assertThat(created.version()).isZero();
        assertThat(created.estado()).isEqualTo(RequestStatus.PENDIENTE);
        assertThat(created.fechaVisita()).isEqualTo(request.fechaVisita());
        assertThat(created.horaDesde()).isEqualTo(request.horaDesde());
        assertThat(created.horaHasta()).isEqualTo(request.horaHasta());
        verify(service).create(request);
    }

    @Test
    void keepsOptionalVisitValuesEmptyWhenTheyAreNotProvided() {
        CreateServiceRequest request = new CreateServiceRequest(
                "123456",
                "Juan Perez",
                "Av. Siempre Viva 123",
                "Falla en el servicio",
                "operador01",
                null,
                null,
                null,
                null,
                null);
        ServiceRequestResponse response = new ServiceRequestResponse(
                2L,
                0,
                request.numeroCuenta(),
                request.nombreTitular(),
                request.direccion(),
                request.motivoPedido(),
                request.operador(),
                null,
                null,
                null,
                null,
                RequestStatus.PENDIENTE);
        when(service.create(request)).thenReturn(response);

        ServiceRequestResponse created = subject.create(request);

        assertThat(created.id()).isPositive();
        assertThat(created.version()).isZero();
        assertThat(created.fechaVisita()).isNull();
        assertThat(created.horaDesde()).isNull();
        assertThat(created.horaHasta()).isNull();
        assertThat(created.estado()).isEqualTo(RequestStatus.PENDIENTE);
    }

    private static final class ServiceRequestCreationTestSubject {

        private final ServiceRequestService service;

        private ServiceRequestCreationTestSubject(ServiceRequestService service) {
            this.service = service;
        }

        private ServiceRequestResponse create(CreateServiceRequest request) {
            return service.create(request);
        }
    }
}
