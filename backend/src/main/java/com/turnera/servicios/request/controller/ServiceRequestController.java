package com.turnera.servicios.request.controller;

import com.turnera.servicios.request.dto.CreateServiceRequest;
import com.turnera.servicios.request.dto.ServiceRequestResponse;
import com.turnera.servicios.request.dto.UpdateServiceRequest;
import com.turnera.servicios.request.service.ServiceRequestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitudes")
public class ServiceRequestController {

  private final ServiceRequestService service;

  public ServiceRequestController(ServiceRequestService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<ServiceRequestResponse>> findAll() {
    return ResponseEntity.ok(service.findAll());
  }

  @PostMapping
  public ResponseEntity<ServiceRequestResponse> create(
      @Valid @RequestBody CreateServiceRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ServiceRequestResponse> findById(@PathVariable Long id) {
    return ResponseEntity.ok(service.findById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ServiceRequestResponse> update(
      @PathVariable Long id, @Valid @RequestBody UpdateServiceRequest request) {
    return ResponseEntity.ok(service.update(id, request));
  }
}
