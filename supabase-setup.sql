-- Run this once in your Supabase project's SQL Editor
-- (Supabase dashboard → SQL Editor → New query → paste this → Run)

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,       -- 'unsaid' or 'journal'
  tag text,                   -- e.g. 'a complaint', 'just because', etc.
  message text not null
);

-- Lock the table down: the public "anon" key (used by the website itself)
-- can only INSERT new rows. It cannot read, update, or delete anything —
-- even if that key is visible in the site's source, which is expected and
-- fine for Supabase's anon key.
alter table messages enable row level security;

create policy "Allow public insert only"
  on messages
  for insert
  to anon
  with check (true);

-- Deliberately no SELECT/UPDATE/DELETE policy for anon — this means the
-- website itself has no way to read messages back out. Reading only happens
-- server-side (app/api/inbox/route.ts) using the separate service_role key,
-- which bypasses RLS entirely and is gated behind the INBOX_PASSCODE.
