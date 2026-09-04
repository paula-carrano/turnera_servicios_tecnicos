package com.turnera.servicios.request.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(columnDefinition = "BIGINT", nullable = false, updatable = false)
  private Long id;

  @Version private Integer version;

  @Column(nullable = false)
  private String numeroCuenta;

  @Column(nullable = false)
  private String nombreTitular;

  @Column(nullable = false)
  private String direccion;

  @Column(nullable = false)
  private String motivoPedido;

  @Column(nullable = false)
  private String operador;

  private LocalDate fechaVisita;

  private LocalTime horaDesde;

  private LocalTime horaHasta;

  private String comentariosServicio;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RequestStatus estado = RequestStatus.PENDIENTE;

  public Solicitud() {}

  public Long getId() {
    return id;
  }

  public Integer getVersion() {
    return version;
  }

  public String getNumeroCuenta() {
    return numeroCuenta;
  }

  public void setNumeroCuenta(String numeroCuenta) {
    this.numeroCuenta = numeroCuenta;
  }

  public String getNombreTitular() {
    return nombreTitular;
  }

  public void setNombreTitular(String nombreTitular) {
    this.nombreTitular = nombreTitular;
  }

  public String getDireccion() {
    return direccion;
  }

  public void setDireccion(String direccion) {
    this.direccion = direccion;
  }

  public String getMotivoPedido() {
    return motivoPedido;
  }

  public void setMotivoPedido(String motivoPedido) {
    this.motivoPedido = motivoPedido;
  }

  public String getOperador() {
    return operador;
  }

  public void setOperador(String operador) {
    this.operador = operador;
  }

  public LocalDate getFechaVisita() {
    return fechaVisita;
  }

  public void setFechaVisita(LocalDate fechaVisita) {
    this.fechaVisita = fechaVisita;
  }

  public LocalTime getHoraDesde() {
    return horaDesde;
  }

  public void setHoraDesde(LocalTime horaDesde) {
    this.horaDesde = horaDesde;
  }

  public LocalTime getHoraHasta() {
    return horaHasta;
  }

  public void setHoraHasta(LocalTime horaHasta) {
    this.horaHasta = horaHasta;
  }

  public String getComentariosServicio() {
    return comentariosServicio;
  }

  public void setComentariosServicio(String comentariosServicio) {
    this.comentariosServicio = comentariosServicio;
  }

  public RequestStatus getEstado() {
    return estado;
  }

  public void setEstado(RequestStatus estado) {
    this.estado = estado;
  }
}
