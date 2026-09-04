const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const RESOURCE_URL = `${API_BASE_URL}/api/solicitudes`;

export class ServiceRequestApiError extends Error {
  constructor(status, response) {
    super(response?.message ?? "No se pudo completar la operación.");
    this.name = "ServiceRequestApiError";
    this.status = status;
    this.code = response?.code ?? "REQUEST_ERROR";
    this.fields = response?.fields ?? null;
  }
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ServiceRequestApiError(0, {
      code: "NETWORK_ERROR",
      message: "No se pudo conectar con el servicio.",
    });
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ServiceRequestApiError(response.status, body);
  }
  return body;
}

export function listServiceRequests() {
  return request(RESOURCE_URL);
}

export function createServiceRequest(serviceRequest) {
  return request(RESOURCE_URL, {
    method: "POST",
    body: JSON.stringify(serviceRequest),
  });
}

export function getServiceRequest(id) {
  return request(`${RESOURCE_URL}/${id}`);
}

export function updateServiceRequest(id, serviceRequest) {
  return request(`${RESOURCE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(serviceRequest),
  });
}
