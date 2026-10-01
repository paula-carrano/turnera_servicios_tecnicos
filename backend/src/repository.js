import { databaseError, HttpError } from './errors.js';

const check = ({ data, error }) => {
  if (error) throw databaseError(error);
  return data;
};
const required = (result) => {
  const data = check(result);
  if (!data) throw new HttpError(404, 'El pedido no existe.');
  return data;
};

// Recorrer páginas evita truncar silenciosamente el listado por el límite de PostgREST.
async function allPages(query) {
  const rows = [];
  const size = 500;
  for (let offset = 0; ; offset += size) {
    const page = check(await query().range(offset, offset + size - 1));
    rows.push(...page);
    if (page.length < size) return rows;
  }
}

export function createRepository(supabase) {
  return {
    async list(tab) {
      return allPages(() => {
        let query = supabase.from('pedidos').select('*');
        if (tab === 'SIN_ASIGNAR') query = query.eq('estado', 'PENDIENTE').is('turno_inicio', null);
        if (tab === 'ASIGNADOS') query = query.eq('estado', 'PENDIENTE').not('turno_inicio', 'is', null);
        if (tab === 'PRUEBA') query = query.eq('estado', 'PRUEBA');
        if (tab === 'FINALIZADOS') query = query.eq('estado', 'FINALIZADO');
        return query.order(tab === 'ASIGNADOS' ? 'turno_inicio' : 'created_at', { ascending: tab === 'ASIGNADOS' }).order('id');
      });
    },
    async get(id) {
      return required(await supabase.from('pedidos').select('*').eq('id', id).maybeSingle());
    },
    async comments(id) {
      return allPages(() => supabase.from('comentarios').select('*').eq('pedido_id', id).order('created_at').order('id'));
    },
    async create(values) {
      return check(await supabase.from('pedidos').insert(values).select().single());
    },
    async update(id, values) {
      return required(await supabase.from('pedidos').update(values).eq('id', id).select().maybeSingle());
    },
    async addComment(id, values) {
      return check(await supabase.from('comentarios').insert({ ...values, pedido_id: id }).select().single());
    },
  };
}
