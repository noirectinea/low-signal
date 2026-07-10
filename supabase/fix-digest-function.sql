create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.digest(data text, type text)
returns bytea
language sql
immutable
strict
set search_path = extensions, public, pg_temp
as $$
  select extensions.digest(data, type);
$$;
