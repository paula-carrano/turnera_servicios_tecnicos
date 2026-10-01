import { DateTime } from 'luxon';
import { ZONE } from '../constants/dateTime.js';

const local = (value) => DateTime.fromISO(value, { zone: ZONE }).setLocale('es-AR');

export const formatDateTime = (value) => local(value).toFormat('dd LLL yyyy · HH:mm');

export const formatSlot = (pedido) => pedido.turno_inicio
  ? `${local(pedido.turno_inicio).toFormat('dd LLL yyyy')} · ${local(pedido.turno_inicio).toFormat('HH:mm')}–${local(pedido.turno_fin).toFormat('HH:mm')}`
  : 'Fecha y horario a coordinar';

export const emptySlot = () => ({ fecha: '', inicio: '', fin: '' });

export const slotFields = (pedido) => pedido.turno_inicio ? {
  fecha: local(pedido.turno_inicio).toISODate(),
  inicio: local(pedido.turno_inicio).toFormat('HH:mm'),
  fin: local(pedido.turno_fin).toFormat('HH:mm'),
} : emptySlot();

export const slotPayload = (slot) => {
  if (!slot.fecha && !slot.inicio && !slot.fin) {
    return { turno_inicio: null, turno_fin: null };
  }
  if (!slot.fecha || !slot.inicio || !slot.fin) {
    throw new Error('Completá fecha, inicio y fin del turno, o quitá el turno.');
  }

  const start = DateTime.fromISO(`${slot.fecha}T${slot.inicio}`, { zone: ZONE });
  const end = DateTime.fromISO(`${slot.fecha}T${slot.fin}`, { zone: ZONE });
  if (!start.isValid || !end.isValid || end <= start || start.toISODate() !== end.toISODate()) {
    throw new Error('El fin debe ser posterior al inicio y dentro del mismo día.');
  }
  return { turno_inicio: start.toUTC().toISO(), turno_fin: end.toUTC().toISO() };
};
