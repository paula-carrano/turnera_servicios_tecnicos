-- Ejecutar una vez en un proyecto vacío de Supabase, desde SQL Editor.
begin;

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_cuenta text not null check (char_length(btrim(numero_cuenta)) between 1 and 80),
  titular text not null check (char_length(btrim(titular)) between 1 and 200),
  direccion text not null check (char_length(btrim(direccion)) between 1 and 500),
  motivo text not null check (char_length(btrim(motivo)) between 1 and 3000),
  operador text not null check (char_length(btrim(operador)) between 1 and 120),
  estado text not null default 'PENDIENTE' check (estado in ('PENDIENTE', 'PRUEBA', 'FINALIZADO')),
  turno_inicio timestamptz,
  turno_fin timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint turno_completo check ((turno_inicio is null) = (turno_fin is null)),
  constraint turno_valido check (
    turno_inicio is null or (
      isfinite(turno_inicio) and isfinite(turno_fin)
      and turno_fin > turno_inicio
      and (turno_inicio at time zone 'America/Argentina/Buenos_Aires')::date
        = (turno_fin at time zone 'America/Argentina/Buenos_Aires')::date
    )
  ),
  constraint pedidos_sin_superposicion exclude using gist (
    tstzrange(turno_inicio, turno_fin, '[)') with &&
  ) where (estado = 'PENDIENTE' and turno_inicio is not null)
);

create table public.comentarios (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete restrict,
  autor text not null check (char_length(btrim(autor)) between 1 and 120),
  texto text not null check (char_length(btrim(texto)) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index pedidos_estado_creacion_idx on public.pedidos (estado, created_at desc, id);
create index pedidos_turno_idx on public.pedidos (turno_inicio, id) where estado = 'PENDIENTE';
create index comentarios_pedido_fecha_idx on public.comentarios (pedido_id, created_at, id);

create function public.set_pedido_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
create trigger pedidos_updated_at before update on public.pedidos
for each row execute function public.set_pedido_updated_at();

alter table public.pedidos enable row level security;
alter table public.comentarios enable row level security;
revoke all on public.pedidos, public.comentarios from anon, authenticated;
-- La clave secreta de Supabase usa service_role, que omite RLS.
revoke all on public.pedidos, public.comentarios from service_role;
grant select, insert, update on public.pedidos to service_role;
grant select, insert on public.comentarios to service_role;
revoke all on function public.set_pedido_updated_at() from public;

commit;
