-- Equipment table
create table if not exists equipment (
  id         bigint generated always as identity primary key,
  name       text not null,
  brand      text not null default '',
  model      text not null default '',
  cat        text not null,
  code       text not null default '',
  st         text not null default 'in',
  own        text not null default '自有',
  val        integer not null default 0,
  day        integer not null default 0,
  dep        integer not null default 0,
  tot        integer not null default 0,
  av         integer not null default 1,
  loc        text not null default '',
  specs      text[] not null default '{}',
  note       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Movements (出入库记录)
create table if not exists movements (
  id         text primary key default gen_random_uuid()::text,
  t          text not null,
  dev        text not null,
  op         text not null,
  by         text not null,
  proj       text not null default '',
  created_at timestamptz not null default now()
);

-- Rental orders
create table if not exists rental_orders (
  id           text primary key default gen_random_uuid()::text,
  project_name text not null,
  items        jsonb not null default '[]',
  days         integer not null default 1,
  created_at   timestamptz not null default now()
);

-- Service inquiries
create table if not exists service_inquiries (
  id           text primary key default gen_random_uuid()::text,
  service_id   text not null,
  contact_name text not null,
  created_at   timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger equipment_updated_at
  before update on equipment
  for each row execute procedure update_updated_at();

-- RLS: allow all reads, restrict writes to authenticated users
alter table equipment enable row level security;
alter table movements enable row level security;
alter table rental_orders enable row level security;
alter table service_inquiries enable row level security;

-- Public read
create policy "public read equipment" on equipment for select using (true);
create policy "public read movements" on movements for select using (true);

-- Authenticated write
create policy "auth write equipment" on equipment for all using (auth.role() = 'authenticated');
create policy "auth write movements" on movements for all using (auth.role() = 'authenticated');
create policy "auth write orders" on rental_orders for all using (auth.role() = 'authenticated');
create policy "auth write inquiries" on service_inquiries for all using (auth.role() = 'authenticated');

-- Anon insert for public forms
create policy "anon insert orders" on rental_orders for insert with check (true);
create policy "anon insert inquiries" on service_inquiries for insert with check (true);
