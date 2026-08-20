create table if not exists fight_takes (
  id         bigserial primary key,
  user_id    text not null,
  score      integer not null,
  clips      integer not null,
  grade      text not null,
  roast      text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists fight_takes_user_id_idx on fight_takes (user_id);
