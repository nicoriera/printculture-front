# AGENTS.md

Guidance for Codex (and other coding agents) working in this repository.

> **Source de vérité unique : [`CLAUDE.md`](./CLAUDE.md).** Tout le guide projet y vit
> (produit CULTURHUB, écrans & routes, modèle de données `User`/`Recommendation`/`Message`,
> pattern de route API, auth, sécurité, styling, workflow de vérification, variables d'env).
> Pour éviter la dérive entre deux fichiers, **ce fichier ne duplique pas** ce contenu —
> lis `CLAUDE.md` en premier.

## Spécifique aux agents

- **Racine du projet = ce dossier `printculture-next/`** (git, `package.json`, `.claude/`,
  `CLAUDE.md`). Lance `pnpm` ici ; depuis le dossier parent `printculture/` ça échoue avec
  `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`.
- Avant de coder : lire `CLAUDE.md` puis les « sources de vérité » qu'il liste
  (`src/lib/schemas.ts`, `src/lib/categories.ts`, `src/lib/api-response.ts`, `src/lib/auth.ts`).
- Après changement : `pnpm type-check` puis `pnpm lint` (et `pnpm build` si routing/config Next).
- Sécurité : valider toute URL utilisateur via `safeUrl()`, ne jamais mettre
  `images.remotePatterns: "**"`, rate-limiter les routes sensibles. Détails dans `CLAUDE.md`.
