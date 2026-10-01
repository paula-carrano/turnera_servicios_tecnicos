import { FIELDS } from '../constants/pedidos.js';
import { slotFields, slotPayload } from './dateTime.js';

export const blankFields = () => Object.fromEntries(FIELDS.map(({ name }) => [name, '']));

export const pedidoFields = (pedido) => Object.fromEntries(
  FIELDS.map(({ name }) => [name, pedido[name]]),
);

export const statusLabel = (pedido) => {
  if (pedido.estado === 'PRUEBA') return 'En prueba';
  if (pedido.estado === 'FINALIZADO') return 'Finalizado';
  return pedido.turno_inicio ? 'Asignado' : 'Sin asignar';
};

export const pedidoChanges = (pedido, values, estado, slot) => {
  const schedule = slotPayload(slot);
  // Enviar solo cambios evita pisar campos que otro operador actualizó.
  const changes = Object.fromEntries(
    Object.entries(values).filter(([key, value]) => value !== pedido[key]),
  );
  if (estado !== pedido.estado) changes.estado = estado;
  const previousSlot = slotFields(pedido);
  if (Object.keys(previousSlot).some((key) => slot[key] !== previousSlot[key])) {
    Object.assign(changes, schedule);
  }
  return changes;
};
