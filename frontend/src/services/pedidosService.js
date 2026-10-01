import { request } from './httpClient.js';

export const pedidosService = {
  list: (tab, signal) => request(`/pedidos?solapa=${encodeURIComponent(tab)}`, { signal }),
  detail: (id, signal) => request(`/pedidos/${id}`, { signal }),
  create: (body) => request('/pedidos', { method: 'POST', body }),
  update: (id, body) => request(`/pedidos/${id}`, { method: 'PATCH', body }),
  comment: (id, body) => request(`/pedidos/${id}/comentarios`, { method: 'POST', body }),
};
