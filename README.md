# Print Culture - Next.js Full-Stack

Application de partage de recommandations culturelles entre amis, migrée de Vue.js + Rails vers Next.js full-stack avec Supabase.

## 🚀 Stack Technique

### Frontend

- **Next.js 15.5.5** avec App Router
- **React 19** avec TypeScript
- **Tailwind CSS 4** pour le styling
- **pnpm** pour la gestion des packages

### Backend

- **Next.js API Routes** pour l'API
- **Prisma ORM** pour la base de données
- **PostgreSQL** via Supabase
- **Supabase Storage** pour les fichiers

### Authentification & Sécurité

- **JWT** avec cookies httpOnly
- **bcrypt** pour le hashage des mots de passe
- **Middleware** de protection des routes

## 📋 Fonctionnalités

- ✅ Authentification (inscription, connexion, déconnexion)
- ✅ CRUD des recommandations (Films, Livres, Musique, Podcasts)
- ✅ Upload de fichiers avec Supabase Storage
- ✅ Interface responsive (mobile/desktop)
- ✅ Protection des routes
- ✅ Gestion d'état avec React Context
- ✅ Validation des formulaires

## 🛠️ Installation

### Prérequis

- Node.js 18+
- pnpm
- Compte Supabase

### 1. Cloner le projet

```bash
git clone <repository-url>
cd printculture-next
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration Supabase

#### Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés API

#### Configurer Supabase Storage

1. Aller dans Storage > Buckets
2. Créer un bucket nommé `recommendations-files`
3. Configurer les policies de sécurité (RLS)

### 4. Variables d'environnement

Créer un fichier `.env.local` :

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# JWT
JWT_SECRET="your_jwt_secret_here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Configuration de la base de données

```bash
# Générer le client Prisma
pnpm exec prisma generate

# Créer les migrations
pnpm exec prisma migrate dev

# (Optionnel) Seeder avec des données de test
pnpm exec prisma db seed
```

### 6. Démarrer l'application

```bash
# Mode développement
pnpm dev

# Mode production
pnpm build
pnpm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentification
│   │   ├── recommendations/ # CRUD recommandations
│   │   └── upload/        # Upload de fichiers
│   ├── login/             # Page de connexion
│   ├── register/          # Page d'inscription
│   ├── recommendations/   # Pages recommandations
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
├── hooks/                 # Hooks personnalisés
├── lib/                   # Utilitaires (Prisma, Auth, etc.)
└── types/                 # Types TypeScript
```

## 🔄 Migration depuis Vue.js + Rails

### Changements principaux

- **Frontend** : Vue.js → Next.js avec React
- **Backend** : Rails API → Next.js API Routes
- **Base de données** : PostgreSQL local → Supabase
- **Authentification** : localStorage → JWT avec cookies
- **Gestion d'état** : Pinia → React Context
- **Upload de fichiers** : Local → Supabase Storage

### Fonctionnalités conservées

- ✅ Design et UX identiques
- ✅ Toutes les fonctionnalités CRUD
- ✅ Responsive design
- ✅ Authentification
- ✅ Upload de fichiers
- ✅ Catégorisation des recommandations

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement Vercel

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Linting
pnpm lint
```

## 📚 API Documentation

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Recommandations

- `GET /api/recommendations` - Liste des recommandations
- `POST /api/recommendations` - Créer une recommandation
- `GET /api/recommendations/[id]` - Détail d'une recommandation
- `PUT /api/recommendations/[id]` - Modifier une recommandation
- `DELETE /api/recommendations/[id]` - Supprimer une recommandation

### Upload

- `POST /api/upload` - Upload de fichier

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Migration réalisée avec succès** ✅

- Vue.js → Next.js
- Rails → Next.js API Routes
- PostgreSQL local → Supabase
- Toutes les fonctionnalités préservées
