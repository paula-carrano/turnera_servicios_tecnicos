package com.turnera.servicios.request.integration;

import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.entity.Solicitud;
import com.turnera.servicios.request.repository.SolicitudRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ServiceRequestPersistenceTest {

    @Autowired
    private SolicitudRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void persistsAndReadsRequestFromPostgres() throws Exception {
        var constructor = Solicitud.class.getDeclaredConstructor();
        constructor.setAccessible(true);

        Solicitud request = constructor.newInstance();
        request.setNumeroCuenta("123456");
        request.setNombreTitular("Juan Perez");
        request.setDireccion("Av. Siempre Viva 123");
        request.setMotivoPedido("Falla en el servicio");
        request.setOperador("operador01");
        request.setEstado(RequestStatus.PENDIENTE);

        Solicitud saved = repository.saveAndFlush(request);
        entityManager.clear();

        Optional<Solicitud> reloaded = repository.findById(saved.getId());

        assertThat(reloaded).isPresent();
        assertThat(reloaded.orElseThrow().getId()).isPositive();
        assertThat(reloaded.orElseThrow().getNumeroCuenta()).isEqualTo("123456");
        assertThat(reloaded.orElseThrow().getVersion()).isZero();
    }
}