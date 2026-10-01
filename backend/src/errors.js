export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function databaseError(error) {
  if (error.code === '23P01') {
    return new HttpError(409, 'Ese horario se superpone con otro pedido pendiente. Elegí otra franja o quitá el turno antes de reabrir el pedido.');
  }
  if (['23514', '23502', '22007', '22008', '22P02'].includes(error.code)) {
    return new HttpError(400, 'Los datos o el intervalo del turno no son válidos.');
  }
  if (error.code === '23503') return new HttpError(404, 'El pedido no existe.');
  return new HttpError(503, 'No pudimos acceder a los datos. Intentá nuevamente en unos instantes.');
}
