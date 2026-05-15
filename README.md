# Print Culture

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

Partagez vos coups de cœur culturels entre amis — films, livres, musique, podcasts.

---

## Quick start

```bash
git clone <repo-url> && cd printculture-next
cp .env.example .env.local   # remplir les variables
pnpm install && pnpm db:migrate
pnpm dev                      # http://localhost:3000
```

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 App Router |
| UI | React 19, Tailwind CSS v4, DMSerifText + Poppins |
| Auth | JWT HS256 (jose) · httpOnly cookies · bcryptjs |
| Base de données | PostgreSQL via Supabase · Prisma ORM |
| Fichiers | Supabase Storage |
| Validation | Zod v4 (source de vérité pour les schémas API) |

---

## Variables d'environnement

Créer `.env.local` à la racine de `printculture-next/` :

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL Supabase | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL publique du projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (publique) | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (secrète, serveur uniquement) | `eyJhbGciOi...` |
| `JWT_SECRET` | Secret de signature JWT — **requis**, pas de fallback | Chaîne aléatoire ≥ 32 caractères |
| `NEXT_PUBLIC_APP_URL` | URL de base de l'app | `http://localhost:3000` |

> **Supabase Storage** : créer un bucket nommé `recommendations-files` dans Storage > Buckets.

---

## Commandes

```bash
pnpm dev            # dev avec Turbopack
pnpm build          # build de production
pnpm type-check     # vérification TypeScript (strict)
pnpm lint           # ESLint

pnpm db:generate    # régénère le client Prisma après modif du schema
pnpm db:migrate     # applique les migrations (dev)
pnpm db:seed        # importe des données initiales
pnpm db:studio      # interface graphique Prisma Studio
pnpm db:reset       # remet la DB à zéro

pnpm docs:generate  # régénère docs/openapi.json depuis les schemas Zod
```

---

## Docs vivantes (API)

La spec OpenAPI est générée automatiquement depuis les schemas Zod — elle reste en sync avec le code de validation.

```bash
pnpm docs:generate   # → docs/openapi.json
pnpm dev             # puis ouvrir http://localhost:3000/api/openapi
```

Coller l'URL (ou le JSON) dans [editor.swagger.io](https://editor.swagger.io) pour parcourir les 10 endpoints de façon interactive.

**Règle :** relancer `pnpm docs:generate` et committer `docs/openapi.json` après toute modification de `src/lib/schemas.ts`.

---

## Troubleshooting

**`Error: JWT_SECRET environment variable is required`**
→ La variable `JWT_SECRET` est absente de `.env.local`. Elle est obligatoire, il n'y a pas de valeur par défaut.

**`Unauthorized` sur `/api/recommendations`**
→ Le token JWT est expiré ou invalide. Se déconnecter et se reconnecter pour obtenir un nouveau cookie.

**`Module not found: Can't resolve 'bcryptjs'` en build**
→ `bcryptjs` a été importé depuis un fichier atteignable par le middleware (Edge Runtime). Utiliser uniquement `@/lib/password` dans les API routes — jamais dans `@/lib/auth` ni `middleware.ts`.

---

## Déploiement (Vercel)

1. Connecter le repo GitHub à Vercel
2. Configurer toutes les variables d'env dans les settings Vercel
3. S'assurer que `DATABASE_URL` pointe vers la même base Supabase que la migration

---

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md).
