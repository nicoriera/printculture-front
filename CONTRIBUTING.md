# Contributing

## Prérequis

- Node.js 18+
- pnpm
- Un projet Supabase (PostgreSQL + Storage)

Voir le [README](README.md) pour le setup complet (env vars, Prisma, démarrage).

---

## Workflow git

| Préfixe | Usage |
|---|---|
| `feat/` | Nouvelle fonctionnalité |
| `fix/` | Correction de bug |
| `chore/` | Maintenance, config, deps |
| `docs/` | Documentation uniquement |

Messages de commit : [Conventional Commits](https://www.conventionalcommits.org/) — `feat(auth): add refresh token`, `fix(api): handle empty recommendations`.

---

## Checklist avant PR

```bash
pnpm type-check   # zéro erreur TypeScript
pnpm lint         # zéro warning ESLint
pnpm build        # build de production sans erreur
```

---

## Règles architecture

### Routes API

Toujours suivre ce pattern dans `src/app/api/*/route.ts` :

```ts
// 1. Auth (si nécessaire)
const token = getTokenFromCookie(request.headers.get("cookie"));
if (!token) return unauthorizedResponse();
const payload = await verifyToken(token);
if (!payload) return unauthorizedResponse();

// 2. Validation Zod
const parsed = MySchema.safeParse(await request.json());
if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

// 3. DB → réponse
const result = await prisma.model.create({ data: parsed.data });
return successResponse({ result }, "Created");
```

### Edge Runtime

`middleware.ts` s'exécute en Edge Runtime (pas de Node.js natif). Ne jamais importer `@/lib/password` depuis `middleware.ts` ou `@/lib/auth`. Toutes les opérations bcrypt passent par `@/lib/password`, qui est importé uniquement depuis les API routes.

### Schemas Zod

`src/lib/schemas.ts` est la source de vérité pour les contrats de données. Chaque champ doit avoir un `.describe("...")` — c'est utilisé à la fois comme documentation IDE et pour la génération OpenAPI.

---

## Docs vivantes

La spec OpenAPI est générée automatiquement depuis les schemas Zod.

**Après toute modification de `src/lib/schemas.ts` :**

```bash
pnpm docs:generate        # régénère docs/openapi.json
```

Committer `docs/openapi.json` avec les changements de schema. La spec est servie à `/api/openapi` en dev — la coller dans [editor.swagger.io](https://editor.swagger.io) pour la parcourir.

---

## Base de données

**Après toute modification de `prisma/schema.prisma` :**

```bash
pnpm db:generate   # régénère le client Prisma
pnpm db:migrate    # applique la migration (crée un fichier dans prisma/migrations/)
```

Ne jamais modifier les fichiers de migration à la main.
