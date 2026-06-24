# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Produit

**CULTURHUB** — « votre bulle culturelle à deux ». App mobile-first où l'on partage et
échange des recommandations culturelles (films, livres, musique, podcasts, expositions).
L'espace est **partagé globalement** : toutes les recommandations et le fil de discussion
sont visibles par tous les comptes de l'instance (« à deux » = l'instance). La marque
affichée est **CULTURHUB** (le package reste `printculture-next`).

> ⚠️ **La racine du projet est ce dossier `printculture-next/`** (git, `package.json`,
> `.claude/`, CLAUDE.md y vivent). Ouvre/lance tout d'ici. Un dossier parent
> `printculture/` l'enveloppe encore mais ne contient plus rien d'utile ; lancer `pnpm`
> depuis ce parent échoue avec `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`.

### Écrans & routes
| Route | Écran | Notes |
|---|---|---|
| `/` | Onboarding (déconnecté) / Feed (connecté) | `src/app/page.tsx` — `Onboarding` sombre + `Feed` (onglets *Pour vous* / *Pour moi*) |
| `/login`, `/register` | Auth | `<AuthForm mode=… />` |
| `/recommendations/[id]` | Détail (fond `bg-ink`) | méta auteur/année/éditeur/langue, *À propos*, *Notre avis*, bouton **Partager** → poste dans le chat |
| `/echanges` | Chat « Échanges » | onglets *Discussion* / *Suggestions*, fil partagé, polling 4 s |
| `/recherche` | Recherche/filtre | sur les recommandations existantes |
| `/profil` | Profil | infos compte + déconnexion |

Navigation : barre basse mobile à 5 onglets dans `src/components/Navigation.tsx`
(Accueil · Recherche · ➕ FAB · Échanges · Profil), visible une fois connecté.

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

# Local Supabase environment (requires Docker + Supabase CLI)
pnpm local:start  # start local Supabase containers
pnpm local:stop   # stop local Supabase containers
pnpm local:reset  # push schema + seed local DB (reads .env.local)
pnpm local:studio # open Supabase Studio at localhost:54323
```

### Local dev setup (first time)

```bash
# 1. Start local Supabase containers (Docker required)
pnpm local:start

# 2. Copy and fill .env.local (paste keys from `supabase status` output)
cp .env.local.example .env.local

# 3. Push Prisma schema and seed the database
pnpm local:reset

# 4. Start the Next.js dev server
pnpm dev
```

Local ports: API `54321` · DB `54322` · Studio `54323` · Email `54324`

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

JWT tokens (7-day, HS256) stockés en httpOnly cookie `auth-token`. `JWT_SECRET` est **requis** en env — absence = erreur au démarrage (pas de fallback). Le middleware `middleware.ts` protège les préfixes `/recommendations`, `/echanges`, `/recherche`, `/profil` — **ajouter toute nouvelle route protégée à cette liste**. `useAuth` redirige vers `/` (le feed) après login/register.

`useAuth` hook (`src/hooks/useAuth.tsx`) expose : `user`, `isLoading`, `login()`, `register()`, `logout()`. `AuthContextType` est défini une seule fois dans `src/types/user.ts`.

### Components

- `<AuthForm mode="login"|"register" />` — formulaire auth partagé
- `<RecommendationModal isOpen onClose onSubmit isMobile />` — modal de création (tous les champs éditoriaux)
- `<FeedCard recommendation />` — ligne du feed/recherche (vignette + texte éditorial)
- `<Tabs tabs active onChange />` — barre d'onglets soulignée (feed + chat)
- `<BrandMark />` — logo en arcs concentriques
- Helpers d'affichage utilisateur : `getInitial()` / `displayName()` dans `src/lib/user.ts`

### Hooks de données

- `useRecommendations()` — liste + CRUD des recommandations.
- `useMessages()` — fil de chat partagé, **polling toutes les 4 s** (pas de websocket). Pourra
  passer à Supabase Realtime plus tard.

### Database

Prisma singleton à `src/lib/prisma.ts`. Modèles : `User`, `Recommendation`, `Message`.
- `Recommendation` : champs de base + champs éditoriaux **optionnels** (`author`, `year`,
  `publisher`, `language`, `imageUrl`, `tagline`, `opinion`) + relation optionnelle `userId`.
  Catégories (`src/lib/schemas.ts`) : `Movie | Book | Music | Podcast | Exhibition`.
- `Message` : `content`, `userId` (expéditeur), `recommendationId?` (reco partagée dans une bulle),
  `createdAt`. Sert le fil partagé de `/echanges`.

Indexes sur `category`, `createdAt`, `userId`. Après modif de `prisma/schema.prisma` :
`pnpm db:generate` puis `local:reset` (local) ou `db:migrate` (DB distante joignable).
**Ajouter un champ Recommendation : suivre le skill `culturhub-add-field`** (ordre Zod → Prisma → types → API → form → UI).

### File storage

Supabase Storage bucket `recommendations-files`. Helpers dans `src/lib/supabase.ts`. Upload via `POST /api/upload` (validation MIME par magic-bytes, taille max 10 Mo, allowlist d'extensions, nom de fichier assaini).

### Sécurité (à respecter)

- **URLs fournies par l'utilisateur → toujours `safeUrl()`** (`src/lib/schemas.ts`), qui rejette
  localhost/IP privées (anti-SSRF). S'applique à `link`, `videoLink`, `imageUrl`.
- **Images distantes arbitraires** : rendues avec `<Image unoptimized />` (FeedCard, détail) pour
  que l'optimiseur Next ne serve **pas** de proxy ouvert. Ne **jamais** mettre
  `images.remotePatterns` à `hostname: "**"`.
- **Rate limiting** (`src/lib/ratelimit.ts`, en mémoire, mono-instance) sur les routes
  sensibles/spammables : auth (`login`/`register`) et `POST /api/messages`.
- Routes mutantes : auth → validation Zod → `userId: payload.userId` (ownership).

### Styling

Tailwind CSS v4 via `@import "tailwindcss"` dans `src/app/globals.css`. Tokens de couleurs par catégorie (`bg-category-movie`, etc.) définis là. Alias `@/*` → `src/*`.

## Workflow git

**Règle : une branche par modification. Jamais de commit direct sur `main`.**
- Avant toute modif : `git switch -c <type>/<sujet>` (`feat/…`, `fix/…`, `chore/…`, `docs/…`).
- Commits sur la branche, puis `git push -u origin <branche>` et `gh pr create --base main`.
- `main` reste l'unique tronc, toujours déployable (GitHub Flow solo). Merge via PR.
- Ne supprimer une branche distante avec des commits non mergés qu'après confirmation explicite.

**Messages de commit : [Conventional Commits](https://www.conventionalcommits.org).**
`type(scope): résumé` à l'impératif, minuscule. Types : `feat`, `fix`, `refactor`, `chore`,
`docs`, `test`, `perf`, `build`, `ci`. Scope optionnel (ex. `feat(chat): …`). Corps si besoin
pour le *pourquoi* ; `!` ou `BREAKING CHANGE:` pour une rupture.

**Avant chaque commit — vérifier et refactoriser :**
1. `pnpm type-check` + `pnpm lint` (0 erreur ; le warning `useRecommendations` exhaustive-deps est connu).
2. Relire le diff : factoriser les doublons, retirer le code mort, réutiliser les helpers/composants
   existants (`lib/`, `components/`) — **sans sur-ingénierie** (pas d'abstraction prématurée, pas de
   couche utilisée une seule fois). Suivre les patterns en place plutôt qu'en inventer.
3. Pour un audit ciblé du diff, l'agent `culturhub-reviewer` couvre conventions + sécurité.

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

**Config Claude Code** — `.claude/` est à la racine du projet (ce dossier), versionnée avec le
code (`settings.local.json` est git-ignoré car local à la machine) :
- Permissions + hook Stop : `.claude/settings.local.json`
- **Lancement des serveurs** : `.claude/launch.json` (servers `next-dev` :3000, `supabase` :54321,
  `prisma-studio` :5555, commandes `pnpm` relatives à la racine). Utiliser l'outil
  `preview_start <name>` plutôt que Bash.
- **Agents** (`.claude/agents/`) : `culturhub-reviewer` (revue conventions + sécurité),
  `culturhub-screen-builder` (nouvel écran dans le design system).
- **Skills** (`.claude/skills/`) : `culturhub-run` (démarrer/reset/seed la stack locale, gotchas
  `.env` vs `.env.local`), `culturhub-add-field` (ajouter un champ Recommendation de bout en bout),
  `culturhub-design-review` (revue visuelle des écrans via le preview MCP vs maquette + tokens + a11y).

**Note historique :** le scaffolding Vue d'avant la migration (`src/views`, `src/router`,
`src/stores`, `src/main.ts`, `index.html`, configs vite/vitest, etc.) a été supprimé — il n'y a
plus de dépendance `vue`. Le dossier `cypress/` subsiste mais sans runner installé.

## Required environment variables

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET          # requis, pas de fallback
NEXT_PUBLIC_APP_URL
```
