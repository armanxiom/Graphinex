create extension if not exists pgcrypto;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text not null,
  avatar_url text,
  role_id uuid not null references roles(id) on delete restrict,
  status text not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  session_hash text not null unique,
  csrf_token_hash text not null,
  user_agent text,
  ip_address text,
  revoked_at timestamptz,
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_sessions_user_idx on admin_sessions(admin_user_id);
create index if not exists admin_sessions_expires_idx on admin_sessions(expires_at);

create table if not exists auth_attempts (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  identifier_hash text not null,
  ip_hash text,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists auth_attempts_scope_idx on auth_attempts(scope, created_at desc);

create table if not exists password_resets (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists password_resets_user_idx on password_resets(admin_user_id, created_at desc);

create table if not exists homepage_content (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hero_sections (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  sort_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  kind text not null,
  mime_type text not null,
  storage_provider text not null default 'vercel-blob',
  storage_path text not null unique,
  public_url text not null unique,
  preview_url text,
  alt_text text,
  size_bytes bigint not null default 0,
  width integer,
  height integer,
  duration_seconds numeric(10,2),
  checksum text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  uploaded_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_kind_idx on media_assets(kind, created_at desc);

create table if not exists seo_settings (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_details (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists footer_content (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  updated_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists published_content (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  version text not null default '0',
  published_by uuid references admin_users(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_admin_user_id uuid references admin_users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_idx on activity_logs(created_at desc);
