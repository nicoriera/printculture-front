# Environnement local

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) en cours d'exécution
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- Node.js ≥ 20, pnpm ≥ 10

## Première installation

### 1. Démarrer les conteneurs Supabase

```bash
pnpm local:start
```

Attendez que la commande affiche les URLs et les clés. Notez les valeurs `anon key` et `service_role key`.

### 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Ouvrez `.env.local` et collez les clés copiées depuis l'output de `pnpm local:start` :

```
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
```

Les autres valeurs (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, etc.) sont déjà pré-remplies pour le dev local.

### 3. Initialiser la base de données

```bash
pnpm local:reset
```

Cette commande :
1. Applique le schéma Prisma sur la DB locale
2. Insère les données de test (5 utilisateurs + 15 recommandations)

### 4. Lancer le serveur de développement

```bash
pnpm dev
```

L'application est disponible sur **http://localhost:3000**.

---

## Commandes utiles

| Commande | Description |
|---|---|
| `pnpm local:start` | Démarre les conteneurs Supabase (DB, Storage, Auth) |
| `pnpm local:stop` | Arrête les conteneurs |
| `pnpm local:reset` | Remet la DB à zéro et reseed les données de test |
| `pnpm local:studio` | Ouvre Supabase Studio |

## URLs locales

| Service | URL |
|---|---|
| Application | http://localhost:3000 |
| Supabase Studio | http://localhost:54323 |
| API Supabase | http://localhost:54321 |
| Base de données | `postgresql://postgres:postgres@localhost:54322/postgres` |
| Boîte mail de test | http://localhost:54324 |

## Comptes de test

Tous les comptes ont le mot de passe `password`.

| Email | Rôle |
|---|---|
| nicolas@example.com | Utilisateur |
| marie@example.com | Utilisateur |
| pierre@example.com | Utilisateur |
| sophie@example.com | Utilisateur |
| admin@printculture.com | Admin |

## Réinitialiser les données

Pour repartir de zéro (sans redémarrer les conteneurs) :

```bash
pnpm local:reset
```

## Problèmes courants

**`relation "User" does not exist`**
Supabase a tenté de seeder avant que Prisma ait créé les tables. Lancez `pnpm local:reset` après `pnpm local:start`.

**`supabase start` échoue**
Docker Desktop n'est pas démarré. Lancez-le et réessayez.

**Les clés Supabase ont changé**
Les clés sont régénérées à chaque `supabase stop / start`. Relancez `pnpm local:start` et mettez à jour `.env.local`.
