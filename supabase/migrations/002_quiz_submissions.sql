-- Quiz submissions table for tracking all attempts
-- The ranking only considers rows where is_first_attempt = true
create table if not exists quiz_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id integer not null,
  quiz_name text not null,
  score integer not null default 0,
  max_score integer not null default 0,
  percentage integer not null default 0,
  answers jsonb default '{}'::jsonb,
  open_answers jsonb default '{}'::jsonb,
  attempt_number integer not null default 1,
  is_first_attempt boolean not null default false,
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Index for fast lookups by user + quiz
create index if not exists idx_quiz_submissions_user_quiz
  on quiz_submissions(user_id, quiz_id);

-- Index for ranking queries (first attempts only)
create index if not exists idx_quiz_submissions_first_attempt
  on quiz_submissions(is_first_attempt) where is_first_attempt = true;

-- RLS policies
alter table quiz_submissions enable row level security;

-- Users can read their own submissions
create policy "Users can read own quiz submissions"
  on quiz_submissions for select
  using (auth.uid() = user_id);

-- Users can insert their own submissions
create policy "Users can insert own quiz submissions"
  on quiz_submissions for insert
  with check (auth.uid() = user_id);

-- Admins and managers can read all submissions (for ranking page)
-- This uses a profile role check
create policy "Admins can read all quiz submissions"
  on quiz_submissions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'manager')
    )
  );
