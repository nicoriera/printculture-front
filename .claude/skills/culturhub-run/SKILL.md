---
name: culturhub-run
description: Start, reset, or seed the CULTURHUB (printculture-next) local dev stack reliably. Use when asked to run the app, bring up the database, reset/seed local data, or when API calls fail with database connection errors.
---

# Running the CULTURHUB stack

The project is flat — run every `pnpm` command from the repo root (no subdirectory).

## Environment gotcha
- Next.js dev loads **`.env.local`** (local Supabase, `DATABASE_URL=…@localhost:54322`) with
  priority over `.env` — so `pnpm dev` talks to the **local** DB.
- Prisma CLI commands (`db:migrate`, `db:reset`) load **`.env`** by default, which points at
  the **remote** Supabase project (often paused). To target local, prefix with
  `DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres" …`.
- **Prisma Studio on the local DB**: use `pnpm db:studio:local` (the `prisma-studio` launch
  config already uses it). Plain `pnpm db:studio` hits the remote `.env` DB.

## Start order (servers are defined in `.claude/launch.json`)
Prefer the `preview_start` tool over raw Bash for long-running servers.
1. **supabase** (port 54321) — local DB/API/Studio (needs Docker). Start this first.
   - If it reports "already running" but a container has exited, run
     `pnpm local:stop` then start again.
2. **next-dev** (port 3000) — the app.
3. **prisma-studio** (port 5555, optional) — GUI on the local DB via `db:studio:local`.

## Apply schema + seed to the local DB
```bash
pnpm local:reset   # prisma db push (schema) + seed (5 users, recos)
```
Run this after any `prisma/schema.prisma` change, or when the local DB is empty/out of sync.
Seed login: `marie@example.com` / `password` (also nicolas/pierre/sophie@example.com).

## Verify
- `curl -s -c /tmp/c.txt -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"marie@example.com","password":"password"}'`
- then `curl -s -b /tmp/c.txt localhost:3000/api/recommendations`
