create extension if not exists pgcrypto;

create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'Open Innovation',
  difficulty text not null default 'Medium',
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.problems enable row level security;

drop policy if exists "Public can read published problems" on public.problems;
create policy "Public can read published problems"
on public.problems for select
using (is_published = true or auth.uid() is not null);

drop policy if exists "Authenticated admins can insert" on public.problems;
create policy "Authenticated admins can insert"
on public.problems for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update" on public.problems;
create policy "Authenticated admins can update"
on public.problems for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete" on public.problems;
create policy "Authenticated admins can delete"
on public.problems for delete
to authenticated
using (true);

insert into public.problems (title, description, category, difficulty, tags)
values
('AI Memory Firewall', 'Design a privacy-first layer that gives people control over what an AI system can remember, forget, or reuse.', 'AI', 'Hard', array['ai','privacy','security']),
('Smart Campus Experience', 'Build a useful digital experience that makes campus life simpler for students, faculty, or visitors.', 'Web', 'Medium', array['web','campus','ux']),
('Open Innovation', 'Solve a meaningful real-world problem using technology, with a clear path to measurable impact.', 'Open Innovation', 'Medium', array['impact','product','innovation'])
on conflict do nothing;
