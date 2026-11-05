-- =====================================================================
-- Test "¿De qué dios serías hijo o hija?": resultados y estadísticas.
-- Usa las mismas cuentas del cuestionario (pj_players) y la función
-- interna pj_auth del archivo 1_esquema.sql.
-- Se puede ejecutar varias veces sin borrar datos.
-- =====================================================================

-- Último resultado de cada jugador (rehacer el test lo reemplaza).
create table if not exists public.pj_god_results (
  player_id  bigint      primary key references public.pj_players(id) on delete cascade,
  parent     text        not null check (parent ~ '^[a-z_]{2,20}$'),
  aspect     text        not null check (aspect in ('g','r')),
  greek      text        not null check (greek  ~ '^[a-z_]{2,20}$'),
  roman      text        not null check (roman  ~ '^[a-z_]{2,20}$'),
  egypt      text        not null check (egypt  ~ '^[a-z_]{2,20}$'),
  scores     jsonb       not null,
  updated_at timestamptz not null default now()
);

alter table public.pj_god_results enable row level security;
revoke all on public.pj_god_results from anon, authenticated;

-- Estadísticas públicas: cuántos jugadores hay por deidad en cada categoría.
-- "kind": parent (progenitor), greek (cabaña), roman, egypt (senda).
-- No expone nicks ni puntajes individuales.
create or replace view public.pj_god_stats as
with r as (
  select g.* from public.pj_god_results g
  join public.pj_players p on p.id = g.player_id
  where public.nick_is_clean(p.nick)
)
select 'parent'::text as kind, parent as god, count(*)::int as players from r group by parent
union all
select 'greek', greek, count(*)::int from r group by greek
union all
select 'roman', roman, count(*)::int from r group by roman
union all
select 'egypt', egypt, count(*)::int from r group by egypt;

revoke all on public.pj_god_stats from anon, authenticated;
grant select on public.pj_god_stats to anon, authenticated;

-- Guardar el resultado del test con nick + PIN.
create or replace function public.pj_save_god(
  p_nick   text,
  p_pin    text,
  p_parent text,
  p_aspect text,
  p_greek  text,
  p_roman  text,
  p_egypt  text,
  p_scores jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_auth jsonb;
  v_pid  bigint;
begin
  if coalesce(p_parent, '') !~ '^[a-z_]{2,20}$'
     or coalesce(p_aspect, '') not in ('g','r')
     or coalesce(p_greek, '')  !~ '^[a-z_]{2,20}$'
     or coalesce(p_roman, '')  !~ '^[a-z_]{2,20}$'
     or coalesce(p_egypt, '')  !~ '^[a-z_]{2,20}$'
     or p_scores is null or jsonb_typeof(p_scores) <> 'object'
     or length(p_scores::text) > 2000 then
    return jsonb_build_object('ok', false, 'error', 'resultado_invalido');
  end if;

  v_auth := public.pj_auth(p_nick, p_pin);
  if not (v_auth->>'ok')::boolean then
    return v_auth;
  end if;
  v_pid := (v_auth->>'id')::bigint;

  insert into public.pj_god_results
    (player_id, parent, aspect, greek, roman, egypt, scores, updated_at)
  values
    (v_pid, p_parent, p_aspect, p_greek, p_roman, p_egypt, p_scores, now())
  on conflict (player_id) do update
    set parent = excluded.parent,
        aspect = excluded.aspect,
        greek = excluded.greek,
        roman = excluded.roman,
        egypt = excluded.egypt,
        scores = excluded.scores,
        updated_at = excluded.updated_at;

  return jsonb_build_object('ok', true, 'nuevo', (v_auth->>'nuevo')::boolean);
end;
$$;

revoke all on function public.pj_save_god(text, text, text, text, text, text, text, jsonb) from public;
grant execute on function public.pj_save_god(text, text, text, text, text, text, text, jsonb) to anon, authenticated;
