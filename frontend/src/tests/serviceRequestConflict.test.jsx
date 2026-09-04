import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RequestFormScreen, {
  getSaveErrorMessage,
} from "../screens/request-form/RequestFormScreen.jsx";
import RequestListScreen, {
  buildGoogleMapsUrl,
} from "../screens/request-list/RequestListScreen.jsx";

describe("Google Maps action", () => {
  it("builds a safely encoded Maps search URL from the stored address", () => {
    expect(buildGoogleMapsUrl("Av. Siempre Viva 123, Córdoba")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Av.%20Siempre%20Viva%20123%2C%20C%C3%B3rdoba",
    );
    expect(buildGoogleMapsUrl("   ")).toBeNull();
  });

  it("renders an external Maps action without adding another screen", () => {
    const html = renderToStaticMarkup(
      <RequestListScreen
        requests={[{
          id: 1,
          numeroCuenta: "AC-100",
          nombreTitular: "Ana Perez",
          direccion: "Av. Siempre Viva 123",
          estado: "PENDIENTE",
        }]}
        loading={false}
        error=""
      />,
    );

    expect(html).toContain("Ver ubicación");
    expect(html).toContain("https://www.google.com/maps/search/");
    expect(html).toContain('target="_blank"');
  });
});

describe("optimistic conflict feedback", () => {
  it("returns an actionable message that states edits are preserved", () => {
    const message = getSaveErrorMessage({ status: 409, code: "VERSION_CONFLICT" });

    expect(message).toContain("Otra persona modificó");
    expect(message).toContain("Tus cambios se conservaron");
    expect(message).toContain("antes de volver a guardar");
  });

  it("keeps the edited request as the form initial state", () => {
    const html = renderToStaticMarkup(
      <RequestFormScreen
        request={{ id: 1, version: 4, numeroCuenta: "Cambio local", estado: "PENDIENTE" }}
        onSave={() => Promise.reject({ status: 409 })}
        onCancel={() => {}}
      />,
    );

    expect(html).toContain('value="Cambio local"');
  });
});
