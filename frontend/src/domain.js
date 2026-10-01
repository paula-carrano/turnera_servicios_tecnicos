import { DateTime } from 'luxon';

export const ZONE = 'America/Argentina/Buenos_Aires';
export const TABS = [
  { id: 'SIN_ASIGNAR', label: 'Sin asignar', icon: 'inbox', description: 'Pedidos pendientes de coordinar una visita.', empty: 'No hay pedidos sin asignar', hint: 'Los nuevos pedidos aparecerán acá, listos para coordinar su visita.' },
  { id: 'ASIGNADOS', label: 'Asignados', icon: 'calendar', description: 'Visitas programadas, ordenadas por fecha y hora.', empty: 'Todavía no hay visitas asignadas', hint: 'Asigná una fecha y un horario desde el detalle de un pedido pendiente.' },
  { id: 'PRUEBA', label: 'En prueba', icon: 'tool', description: 'Servicios en seguimiento para comprobar su funcionamiento.', empty: 'No hay pedidos en prueba', hint: 'Los pedidos que marques como PRUEBA se mostrarán acá.' },
  { id: 'FINALIZADOS', label: 'Finalizados', icon: 'check', description: 'Servicios finalizados y su historial de atención.', empty: 'Todavía no hay pedidos finalizados', hint: 'Cuando completes un servicio, cambialo a FINALIZADO para verlo acá.' },
];
export const FIELDS = [
  { name: 'numero_cuenta', label: 'Número de cuenta', max: 80, placeholder: 'Ej. 00012345' },
  { name: 'titular', label: 'Titular de la cuenta', max: 200, placeholder: 'Nombre y apellido' },
  { name: 'direccion', label: 'Dirección', max: 500, placeholder: 'Calle, número, localidad y provincia', wide: true },
  { name: 'motivo', label: 'Motivo del servicio', max: 3000, placeholder: 'Contá qué sucede y qué necesita revisar el técnico', wide: true, multiline: true },
  { name: 'operador', label: 'Operador que generó el pedido', max: 120, placeholder: 'Nombre del operador', wide: true },
];
export const blankFields = () => Object.fromEntries(FIELDS.map(({ name }) => [name, '']));
export const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const local = (value) => DateTime.fromISO(value, { zone: ZONE }).setLocale('es-AR');
export const formatDateTime = (value) => local(value).toFormat("dd LLL yyyy · HH:mm");
export const formatSlot = (pedido) => pedido.turno_inicio
  ? `${local(pedido.turno_inicio).toFormat('dd LLL yyyy')} · ${local(pedido.turno_inicio).toFormat('HH:mm')}–${local(pedido.turno_fin).toFormat('HH:mm')}`
  : 'Fecha y horario a coordinar';
export const statusLabel = (pedido) => pedido.estado === 'PRUEBA' ? 'En prueba' : pedido.estado === 'FINALIZADO' ? 'Finalizado' : pedido.turno_inicio ? 'Asignado' : 'Sin asignar';
export function slotFields(pedido) {
  return pedido.turno_inicio ? {
    fecha: local(pedido.turno_inicio).toISODate(), inicio: local(pedido.turno_inicio).toFormat('HH:mm'), fin: local(pedido.turno_fin).toFormat('HH:mm'),
  } : { fecha: '', inicio: '', fin: '' };
}
export function slotPayload(slot) {
  if (!slot.fecha && !slot.inicio && !slot.fin) return { turno_inicio: null, turno_fin: null };
  if (!slot.fecha || !slot.inicio || !slot.fin) throw new Error('Completá fecha, inicio y fin del turno, o quitá el turno.');
  const start = DateTime.fromISO(`${slot.fecha}T${slot.inicio}`, { zone: ZONE });
  const end = DateTime.fromISO(`${slot.fecha}T${slot.fin}`, { zone: ZONE });
  if (!start.isValid || !end.isValid || end <= start || start.toISODate() !== end.toISODate()) throw new Error('El fin debe ser posterior al inicio y dentro del mismo día.');
  return { turno_inicio: start.toUTC().toISO(), turno_fin: end.toUTC().toISO() };
}
