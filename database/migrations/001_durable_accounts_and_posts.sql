create table if not exists career_pivot_accounts (
  email text primary key,
  display_name text not null,
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now(),
  onboarding_required boolean not null default true,
  onboarding_completed_at timestamptz
);

-- statement-breakpoint

create table if not exists career_pivot_posts (
  id uuid primary key,
  author_email text not null references career_pivot_accounts(email) on delete cascade,
  updated_at timestamptz not null,
  payload jsonb not null,
  constraint career_pivot_posts_payload_object check (jsonb_typeof(payload) = 'object')
);

-- statement-breakpoint

create index if not exists career_pivot_posts_author_updated_idx
  on career_pivot_posts (author_email, updated_at desc);
