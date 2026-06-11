-- Ejecutar una vez en Supabase → SQL Editor (proyecto de la clienta).
-- La clienta NO entra aquí: solo vos o quien despliegue el sitio.

-- Catálogo del sitio (piezas, bitácora, portafolio, talleres)
create table if not exists public.site_catalog (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_catalog enable row level security;

drop policy if exists "catalog_public_read" on public.site_catalog;
create policy "catalog_public_read"
  on public.site_catalog
  for select
  using (true);

-- Bucket de imágenes del CMS (público para leer; escribir solo vía API con service role)
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do update set public = true;

drop policy if exists "cms_media_public_read" on storage.objects;
create policy "cms_media_public_read"
  on storage.objects
  for select
  using (bucket_id = 'cms-media');
