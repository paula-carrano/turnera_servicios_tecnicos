const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

export const request = async (path, { method = 'GET', body, signal } = {}) => {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      ...(body && { body: JSON.stringify(body) }),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('No pudimos conectar con el servidor. Revisá tu conexión e intentá nuevamente.');
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const details = payload?.error?.details?.map((item) => item.mensaje).join(' ');
    throw new Error(details || payload?.error?.message || 'No se pudo completar la operación.');
  }
  if (!payload) throw new Error('El servidor devolvió una respuesta inválida.');
  return payload;
};
