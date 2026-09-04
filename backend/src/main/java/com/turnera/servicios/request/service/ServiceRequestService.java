package com.turnera.servicios.request.service;

import com.turnera.servicios.request.dto.CreateServiceRequest;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.dto.UpdateServiceRequest;
import com.turnera.servicios.request.entity.Solicitud;
import com.turnera.servicios.request.exception.RequestNotFoundException;
import com.turnera.servicios.request.exception.RequestValidationException;
import com.turnera.servicios.request.exception.RequestVersionConflictException;
import com.turnera.servicios.request.mapper.ServiceRequestMapper;
import com.turnera.servicios.request.repository.SolicitudRepository;
import jakarta.persistence.OptimisticLockException;
import java.util.List;
import java.util.Objects;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceRequestService {

  private final SolicitudRepository solicitudRepository;
  private final ServiceRequestMapper serviceRequestMapper;

  public ServiceRequestService(
      SolicitudRepository solicitudRepository, ServiceRequestMapper serviceRequestMapper) {
    this.solicitudRepository = solicitudRepository;
    this.serviceRequestMapper = serviceRequestMapper;
  }

  @Transactional
  public ServiceRequestResponse create(CreateServiceRequest request) {
    validateRequiredText(
        request.numeroCuenta(),
        request.nombreTitular(),
        request.direccion(),
        request.motivoPedido(),
        request.operador());
    validateVisitHours(request.horaDesde(), request.horaHasta());
    Solicitud solicitud = serviceRequestMapper.toEntity(request);
    Solicitud savedSolicitud = solicitudRepository.save(solicitud);
    return serviceRequestMapper.toResponse(savedSolicitud);
  }

  @Transactional(readOnly = true)
  public List<ServiceRequestResponse> findAll() {
    return solicitudRepository.findAll().stream().map(serviceRequestMapper::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ServiceRequestResponse findById(Long id) {
    return solicitudRepository
        .findById(id)
        .map(serviceRequestMapper::toResponse)
        .orElseThrow(
            () -> new RequestNotFoundException("No se encontr\u00f3 la solicitud " + id + "."));
  }

  @Transactional
  public ServiceRequestResponse update(Long id, UpdateServiceRequest request) {
    validateRequiredText(
        request.numeroCuenta(),
        request.nombreTitular(),
        request.direccion(),
        request.motivoPedido(),
        request.operador());
    validateVisitHours(request.horaDesde(), request.horaHasta());
    Solicitud solicitud =
        solicitudRepository
            .findById(id)
            .orElseThrow(
                () -> new RequestNotFoundException("No se encontr\u00f3 la solicitud " + id + "."));
    if (!Objects.equals(request.version(), solicitud.getVersion())) {
      throw new RequestVersionConflictException("La solicitud fue modificada por otra persona.");
    }
    serviceRequestMapper.updateEntity(request, solicitud);
    try {
      return serviceRequestMapper.toResponse(solicitudRepository.saveAndFlush(solicitud));
    } catch (OptimisticLockException | OptimisticLockingFailureException exception) {
      throw new RequestVersionConflictException("La solicitud fue modificada por otra persona.");
    }
  }

  private void validateRequiredText(String... values) {
    for (String value : values) {
      if (value == null || value.isBlank()) {
        throw new RequestValidationException(
            "Los campos obligatorios no pueden estar vac\u00edos.");
      }
    }
  }

  private void validateVisitHours(java.time.LocalTime horaDesde, java.time.LocalTime horaHasta) {
    if (horaDesde != null && horaHasta != null && !horaHasta.isAfter(horaDesde)) {
      throw new RequestValidationException("horaHasta debe ser posterior a horaDesde.");
    }
  }
}
