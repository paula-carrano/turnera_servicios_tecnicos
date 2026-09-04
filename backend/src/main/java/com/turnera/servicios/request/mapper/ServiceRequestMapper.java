package com.turnera.servicios.request.mapper;

import com.turnera.servicios.request.dto.CreateServiceRequest;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.dto.UpdateServiceRequest;
import com.turnera.servicios.request.entity.RequestStatus;
import com.turnera.servicios.request.entity.Solicitud;
import org.springframework.stereotype.Component;

@Component
public class ServiceRequestMapper {

  public Solicitud toEntity(CreateServiceRequest request) {
    Solicitud solicitud = new Solicitud();
    solicitud.setNumeroCuenta(request.numeroCuenta());
    solicitud.setNombreTitular(request.nombreTitular());
    solicitud.setDireccion(request.direccion());
    solicitud.setMotivoPedido(request.motivoPedido());
    solicitud.setOperador(request.operador());
    solicitud.setFechaVisita(request.fechaVisita());
    solicitud.setHoraDesde(request.horaDesde());
    solicitud.setHoraHasta(request.horaHasta());
    solicitud.setComentariosServicio(request.comentariosServicio());
    solicitud.setEstado(request.estado() == null ? RequestStatus.PENDIENTE : request.estado());
    return solicitud;
  }

  public ServiceRequestResponse toResponse(Solicitud solicitud) {
    return new ServiceRequestResponse(
        solicitud.getId(),
        solicitud.getVersion(),
        solicitud.getNumeroCuenta(),
        solicitud.getNombreTitular(),
        solicitud.getDireccion(),
        solicitud.getMotivoPedido(),
        solicitud.getOperador(),
        solicitud.getFechaVisita(),
        solicitud.getHoraDesde(),
        solicitud.getHoraHasta(),
        solicitud.getComentariosServicio(),
        solicitud.getEstado());
  }

  public void updateEntity(UpdateServiceRequest request, Solicitud solicitud) {
    solicitud.setNumeroCuenta(request.numeroCuenta());
    solicitud.setNombreTitular(request.nombreTitular());
    solicitud.setDireccion(request.direccion());
    solicitud.setMotivoPedido(request.motivoPedido());
    solicitud.setOperador(request.operador());
    solicitud.setFechaVisita(request.fechaVisita());
    solicitud.setHoraDesde(request.horaDesde());
    solicitud.setHoraHasta(request.horaHasta());
    solicitud.setComentariosServicio(request.comentariosServicio());
    solicitud.setEstado(request.estado() == null ? RequestStatus.PENDIENTE : request.estado());
  }
}
