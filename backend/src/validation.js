import { z } from 'zod';
import { DateTime } from 'luxon';
import { HttpError } from './errors.js';

export const ZONE = 'America/Argentina/Buenos_Aires';
export const TABS = ['SIN_ASIGNAR', 'ASIGNADOS', 'PRUEBA', 'FINALIZADOS'];
const text = (max) => z.string().trim().min(1, 'Este campo es obligatorio.').max(max, `Máximo ${max} caracteres.`);
const fields = {
  numero_cuenta: text(80),
  titular: text(200),
  direccion: text(500),
  motivo: text(3000),
  operador: text(120),
};
const instant = z.iso.datetime({ offset: true }).refine((value) => {
  const date = DateTime.fromISO(value, { setZone: true });
  return date.isValid && date.year >= 1 && date.year <= 9999;
}, 'Fecha inválida.').nullable();

export const createSchema = z.strictObject(fields);
export const updateSchema = z.strictObject({
  ...fields,
  estado: z.enum(['PENDIENTE', 'PRUEBA', 'FINALIZADO']),
  turno_inicio: instant,
  turno_fin: instant,
}).partial().superRefine((data, ctx) => {
  if (!Object.keys(data).length) ctx.addIssue({ code: 'custom', message: 'Indicá al menos un cambio.' });
  const hasStart = Object.hasOwn(data, 'turno_inicio');
  const hasEnd = Object.hasOwn(data, 'turno_fin');
  if (hasStart !== hasEnd || (hasStart && (data.turno_inicio === null) !== (data.turno_fin === null))) {
    ctx.addIssue({ code: 'custom', path: ['turno_inicio'], message: 'Ingresá inicio y fin juntos, o quitá ambos.' });
    return;
  }
  if (data.turno_inicio && data.turno_fin) {
    const start = DateTime.fromISO(data.turno_inicio).setZone(ZONE);
    const end = DateTime.fromISO(data.turno_fin).setZone(ZONE);
    if (!start.isValid || !end.isValid || end <= start || start.toISODate() !== end.toISODate()) {
      ctx.addIssue({ code: 'custom', path: ['turno_fin'], message: 'El fin debe ser posterior al inicio y dentro del mismo día de Buenos Aires.' });
    }
  }
});
export const commentSchema = z.strictObject({ autor: text(120), texto: text(5000) });
export const idSchema = z.uuid();
export const querySchema = z.strictObject({ solapa: z.enum(TABS).default('SIN_ASIGNAR') });

export function parse(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new HttpError(400, 'Revisá los datos ingresados.', result.error.issues.map((issue) => ({
      campo: issue.path.join('.'), mensaje: issue.message,
    })));
  }
  return result.data;
}
