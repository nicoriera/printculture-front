# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server with Turbopack
pnpm build        # production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript (no emit)

pnpm db:generate  # regenerate Prisma client after schema changes
pnpm db:migrate   # apply migrations (dev)
pnpm db:reset     # reset database
pnpm db:seed      # populate database from scripts/migrate-data.ts
pnpm db:studio    # open Prisma Studio GUI
```

## Architecture

**Stack:** Next.js 15 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 · Prisma + Supabase PostgreSQL · JWT auth (jose) · Supabase Storage · Zod validation

### Sources de vérité (lire en premier)

| Fichier | Contenu |
|---|---|
| `src/lib/schemas.ts` | Tous les schemas Zod — contrats de données, types inférés, enum des catégories |
| `src/lib/categories.ts` | Couleurs, labels et utilitaires des catégories |
| `src/lib/api-response.ts` | Helpers de réponse API (`successResponse`, `errorResponse`, `unauthorizedResponse`, `notFoundResponse`) |
| `src/lib/auth.ts` | JWT (sign/verify) + extraction cookie — Edge Runtime safe |
| `src/lib/password.ts` | bcrypt hash/verify — Node.js only, never imported from middleware |

### Pattern d'une route API

```ts
// src/app/api/[resource]/route.ts
import { MySchema } from "@/lib/schemas";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // 1. Auth (si nécessaire)
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (!token) return unauthorizedResponse();
  const payload = await verifyToken(token);
  if (!payload) return unauthorizedResponse();

  // 2. Validation Zod
  const parsed = MySchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

  // 3. DB + réponse
  const result = await prisma.model.create({ data: parsed.data });
  return successResponse({ result }, "Created");
}
```

### Auth

JWT tokens (7-day, HS256) stockés en httpOnly cookie `auth-token`. `JWT_SECRET` est **requis** en env — absence = erreur au démarrage (pas de fallback). Le middleware `middleware.ts` protège toutes les routes `/recommendations/*`.

`useAuth` hook (`src/hooks/useAuth.tsx`) expose : `user`, `isLoading`, `login()`, `register()`, `logout()`. `AuthContextType` est défini une seule fois dans `src/types/user.ts`.

### Components

- `<AuthForm mode="login"|"register" />` — formulaire auth partagé
- `<CategorySection category items onDelete />` — section par catégorie
- `<RecommendationCard recommendation onDelete />` — carte individuelle
- `<RecommendationModal isOpen onClose onSubmit isMobile />` — modal de création

### Database

Prisma singleton à `src/lib/prisma.ts`. Schema : `User` + `Recommendation` (avec relation optionnelle `userId`). Indexes sur `category`, `createdAt`, `userId`. Après chaque modification de `prisma/schema.prisma` : `pnpm db:generate`.

### File storage

Supabase Storage bucket `recommendations-files`. Helpers dans `src/lib/supabase.ts`. Upload via `POST /api/upload`.

### Styling

Tailwind CSS v4 via `@import "tailwindcss"` dans `src/app/globals.css`. Tokens de couleurs par catégorie (`bg-category-movie`, etc.) définis là. Alias `@/*` → `src/*`.

## Workflow agent

**Validation automatique :** un hook `Stop` lance `pnpm type-check` à la fin de chaque réponse Claude Code. Si des erreurs TypeScript apparaissent, elles s'affichent au début du tour suivant — pas besoin de lancer manuellement.

**Ordre de vérification après des changements :**
1. `pnpm type-check` — TypeScript strict (lancé automatiquement par le hook)
2. `pnpm lint` — ESLint
3. `pnpm build` — si les changements touchent la configuration Next.js ou le routing

**Après une modification du schema Prisma :**
```bash
pnpm db:generate   # regénérer le client Prisma
pnpm db:migrate    # appliquer la migration en dev
```

**Config Claude Code :**
- Permissions + hook Stop : `/Users/nicolas/DEV/Projets/printculture/.claude/settings.local.json`
- Ce fichier : `printculture-next/CLAUDE.md`

## Required environment variables

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET          # requis, pas de fallback
NEXT_PUBLIC_APP_URL
```
