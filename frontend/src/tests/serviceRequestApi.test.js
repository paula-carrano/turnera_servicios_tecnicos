import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ServiceRequestApiError,
  createServiceRequest,
  getServiceRequest,
  listServiceRequests,
  updateServiceRequest,
} from "../services/serviceRequestApi.js";

afterEach(() => vi.unstubAllGlobals());

describe("serviceRequestApi", () => {
  it("uses the four endpoints defined by the contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ id: 12, version: 0 }));
    vi.stubGlobal("fetch", fetchMock);

    await listServiceRequests();
    await createServiceRequest({ numeroCuenta: "AC-100" });
    await getServiceRequest(12);
    await updateServiceRequest(12, { numeroCuenta: "AC-100", version: 0 });

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/solicitudes", expect.objectContaining({ headers: expect.any(Object) }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/solicitudes", expect.objectContaining({ method: "POST" }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/solicitudes/12", expect.objectContaining({ headers: expect.any(Object) }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, "/api/solicitudes/12", expect.objectContaining({ method: "PUT" }));
  });

  it("exposes consistent contract error data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(
      { code: "VALIDATION_ERROR", message: "Datos inválidos", fields: { operador: "obligatorio" } },
      400,
    )));

    await expect(createServiceRequest({})).rejects.toMatchObject({
      name: "ServiceRequestApiError",
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Datos inválidos",
      fields: { operador: "obligatorio" },
    });
  });

  it("uses a safe fallback when an error is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: vi.fn().mockRejectedValue(new Error()) }));

    await expect(listServiceRequests()).rejects.toBeInstanceOf(ServiceRequestApiError);
  });

  it("normalizes network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(listServiceRequests()).rejects.toMatchObject({
      status: 0,
      code: "NETWORK_ERROR",
    });
  });
});

function response(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}
