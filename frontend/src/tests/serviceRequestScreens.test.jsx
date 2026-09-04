import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RequestFormScreen from "../screens/request-form/RequestFormScreen.jsx";
import RequestListScreen from "../screens/request-list/RequestListScreen.jsx";

const handlers = { onRetry: vi.fn(), onCreate: vi.fn(), onEdit: vi.fn() };

describe("RequestListScreen", () => {
  it("renders loading, error and empty states", () => {
    expect(renderList({ loading: true })).toContain("Cargando solicitudes");
    expect(renderList({ error: "No se pudo consultar" })).toContain("No se pudo consultar");
    expect(renderList()).toContain("No hay solicitudes registradas");
  });

  it("renders requests, status and edit action", () => {
    const html = renderList({ requests: [{
      id: 7,
      numeroCuenta: "AC-100",
      nombreTitular: "Ana Perez",
      direccion: "Av. Siempre Viva 123",
      fechaVisita: "2026-09-10",
      horaDesde: "09:00:00",
      horaHasta: "12:00:00",
      estado: "EN_PRUEBA",
    }] });

    expect(html).toContain("AC-100");
    expect(html).toContain("EN PRUEBA");
    expect(html).toContain("Editar");
  });
});

describe("RequestFormScreen", () => {
  it("renders every contract field for creation", () => {
    const html = renderToStaticMarkup(<RequestFormScreen onSave={vi.fn()} onCancel={vi.fn()} />);
    for (const field of [
      "numeroCuenta", "nombreTitular", "direccion", "motivoPedido", "operador",
      "fechaVisita", "horaDesde", "horaHasta", "comentariosServicio", "estado",
    ]) {
      expect(html).toContain(`name=\"${field}\"`);
    }
    expect(html).toContain("Nueva solicitud");
  });

  it("prefills the update form and shows allowed statuses", () => {
    const html = renderToStaticMarkup(
      <RequestFormScreen
        request={{ id: 7, version: 2, numeroCuenta: "AC-100", estado: "FINALIZADO" }}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(html).toContain("Editar solicitud");
    expect(html).toContain('value="AC-100"');
    expect(html).toContain("PENDIENTE");
    expect(html).toContain("EN PRUEBA");
    expect(html).toContain("FINALIZADO");
  });
});

function renderList(overrides = {}) {
  return renderToStaticMarkup(
    <RequestListScreen
      requests={[]}
      loading={false}
      error=""
      {...handlers}
      {...overrides}
    />,
  );
}
