-- 器材管理平台 · 本地 PostgreSQL schema（幂等，可重复执行）
-- 由 deploy/setup.sh 通过 psql -f 应用

-- ── 设备台账 ─────────────────────────────────────────────
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

-- ── 出入库记录（注意：by 是 PG 保留字，必须加引号）──────────
create table if not exists movements (
  id         text primary key,
  t          text not null,
  dev        text not null,
  op         text not null,
  "by"       text not null,
  proj       text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists movements_created_at_idx on movements (created_at desc);

-- ── 租用申请（前台公开表单）──────────────────────────────
create table if not exists rental_orders (
  id           text primary key,
  project_name text not null,
  items        jsonb not null default '[]',
  days         integer not null default 1,
  created_at   timestamptz not null default now()
);

-- ── 服务咨询（前台公开表单）──────────────────────────────
create table if not exists service_inquiries (
  id           text primary key,
  service_id   text not null,
  contact_name text not null,
  created_at   timestamptz not null default now()
);

-- ── 内部成员账号（密码只存 bcrypt 哈希，绝不存明文）────────
create table if not exists users (
  id            bigint generated always as identity primary key,
  email         text not null unique,
  name          text not null default '',
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- ── 登录会话（token 列存 sha256 哈希，cookie 里是原始值）───
create table if not exists sessions (
  token      text primary key,
  user_id    bigint not null references users(id) on delete cascade,
  expires_at timestamptz not null
);
create index if not exists sessions_expires_at_idx on sessions (expires_at);
create index if not exists sessions_user_id_idx on sessions (user_id);

-- ── equipment.updated_at 自动更新 ────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists equipment_updated_at on equipment;
create trigger equipment_updated_at
  before update on equipment
  for each row execute procedure update_updated_at();
