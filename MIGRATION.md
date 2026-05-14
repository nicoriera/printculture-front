# Guide de Migration Vue.js + Rails vers Next.js

## 📋 Résumé de la Migration

Cette migration transforme une application full-stack Vue.js + Rails en une application Next.js full-stack moderne, en conservant toutes les fonctionnalités existantes.

## 🔄 Changements Architecturaux

### Avant (Vue.js + Rails)

```
printculture-front/     # Vue.js 3 + Vite + Tailwind
printculture-back/      # Rails 7 + PostgreSQL
```

### Après (Next.js Full-Stack)

```
printculture-next/      # Next.js 15 + Supabase + Prisma
```

## 🛠️ Stack Technique Migrée

| Composant              | Avant            | Après                   | Justification            |
| ---------------------- | ---------------- | ----------------------- | ------------------------ |
| **Frontend**           | Vue.js 3 + Vite  | Next.js 15 + App Router | Performance, SEO, DX     |
| **Backend**            | Rails 7 API      | Next.js API Routes      | Simplicité, monorepo     |
| **Base de données**    | PostgreSQL local | Supabase PostgreSQL     | Scalabilité, maintenance |
| **ORM**                | ActiveRecord     | Prisma                  | Type safety, modern DX   |
| **Authentification**   | localStorage     | JWT + cookies httpOnly  | Sécurité renforcée       |
| **Upload de fichiers** | Local storage    | Supabase Storage        | Scalabilité, CDN         |
| **Gestion d'état**     | Pinia            | React Context           | Simplicité, intégration  |
| **Package manager**    | npm              | pnpm                    | Performance, efficacité  |

## 📁 Mapping des Fichiers

### Frontend (Vue → React)

| Vue.js                                   | Next.js                                                | Description                         |
| ---------------------------------------- | ------------------------------------------------------ | ----------------------------------- |
| `src/views/HomeView.vue`                 | `src/app/page.tsx`                                     | Page d'accueil                      |
| `src/views/LoginView.vue`                | `src/app/login/page.tsx`                               | Page de connexion                   |
| `src/views/RegisterView.vue`             | `src/app/register/page.tsx`                            | Page d'inscription                  |
| `src/views/RecomendationListView.vue`    | `src/app/recommendations/page.tsx`                     | Liste des recommandations           |
| `src/views/RecomendationDetailsView.vue` | `src/app/recommendations/[id]/page.tsx`                | Détail d'une recommandation         |
| `src/composable/useRecommendations.ts`   | `src/hooks/useRecommendations.ts`                      | Hook de gestion des recommandations |
| `src/services/recomendation.ts`          | Intégré dans les hooks                                 | Service API                         |
| `src/types/recommendation.ts`            | `src/types/recommendation.ts`                          | Types TypeScript                    |
| `src/router/index.ts`                    | Next.js App Router                                     | Routage                             |
| `src/App.vue`                            | `src/app/layout.tsx` + `src/components/Navigation.tsx` | Layout et navigation                |

### Backend (Rails → Next.js API Routes)

| Rails                                                  | Next.js                                     | Description           |
| ------------------------------------------------------ | ------------------------------------------- | --------------------- |
| `app/controllers/api/v1/recommendations_controller.rb` | `src/app/api/recommendations/route.ts`      | CRUD recommandations  |
| `app/controllers/api/v1/recommendations_controller.rb` | `src/app/api/recommendations/[id]/route.ts` | CRUD par ID           |
| `app/models/recommendation.rb`                         | `prisma/schema.prisma`                      | Modèle de données     |
| `config/routes.rb`                                     | Next.js App Router                          | Routes API            |
| `config/initializers/cors.rb`                          | Non nécessaire                              | CORS géré par Next.js |

## 🔧 Adaptations Techniques

### 1. Gestion de l'État

**Vue.js (Pinia)**

```javascript
// store/recommendations.js
export const useRecommendationsStore = defineStore("recommendations", () => {
  const recommendations = ref([]);
  const addRecommendation = async (rec) => {
    // logique
  };
  return { recommendations, addRecommendation };
});
```

**React (Context)**

```typescript
// hooks/useRecommendations.ts
export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const addRecommendation = async (rec) => {
    // logique
  };
  return { recommendations, addRecommendation };
}
```

### 2. Authentification

**Vue.js (localStorage)**

```javascript
const isAuthenticated = ref(!!localStorage.getItem("authToken"));
```

**React (JWT + cookies)**

```typescript
// lib/auth.ts
export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(JWT_SECRET);
}
```

### 3. Upload de Fichiers

**Avant (Local)**

```javascript
// Upload direct vers le serveur local
```

**Après (Supabase Storage)**

```typescript
// lib/supabase.ts
export async function uploadFile(bucket, file, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  return data;
}
```

## 🎨 Adaptations UI/UX

### Composants Migrés

| Vue.js       | React                          | Changements                |
| ------------ | ------------------------------ | -------------------------- |
| `v-if`       | `{condition && <Component />}` | Syntaxe conditionnelle     |
| `v-for`      | `.map()`                       | Rendu de listes            |
| `v-model`    | `value` + `onChange`           | Liaison bidirectionnelle   |
| `@click`     | `onClick`                      | Gestionnaires d'événements |
| `ref()`      | `useState()`                   | État réactif               |
| `computed()` | `useMemo()`                    | Valeurs calculées          |
| `watch()`    | `useEffect()`                  | Effets de bord             |

### Styles (Tailwind CSS)

- Conservation de toutes les classes Tailwind
- Adaptation des fonts Poppins et DMSerifText
- Conservation du thème sombre/clair

## 🗄️ Migration des Données

### Schéma de Base de Données

**Avant (Rails)**

```ruby
create_table "recommendations" do |t|
  t.string "title"
  t.text "description"
  t.string "category"
  t.string "link"
  t.string "tag"
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
end
```

**Après (Prisma)**

```prisma
model Recommendation {
  id          Int      @id @default(autoincrement())
  title       String
  description String?  @db.Text
  category    String?
  link        String?
  tag         String?
  videoLink   String?
  fileUrl     String?  // Nouveau
  fileName    String?  // Nouveau
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Script de Migration

```typescript
// scripts/migrate-data.ts
async function migrateData() {
  // 1. Lire les données de l'ancienne DB
  // 2. Transformer les données
  // 3. Insérer dans la nouvelle DB
  // 4. Vérifier l'intégrité
}
```

## 🔒 Sécurité Renforcée

### Authentification

- **Avant** : localStorage (vulnérable au XSS)
- **Après** : JWT en cookies httpOnly (protection XSS)

### Validation

- **Avant** : Validation côté serveur Rails
- **Après** : Validation côté client + serveur avec Prisma

### Upload de Fichiers

- **Avant** : Upload local sans restrictions
- **Après** : Supabase Storage avec policies RLS

## 📊 Performance

### Optimisations Next.js

- **Server Components** : Rendu côté serveur pour SEO
- **Code Splitting** : Chargement à la demande
- **Image Optimization** : Optimisation automatique des images
- **Static Generation** : Génération statique quand possible

### Base de Données

- **Avant** : PostgreSQL local
- **Après** : Supabase (PostgreSQL managé + CDN)

## 🚀 Déploiement

### Avant

- Frontend : Netlify
- Backend : Serveur Rails
- Base de données : PostgreSQL local

### Après

- Application : Vercel (full-stack)
- Base de données : Supabase (PostgreSQL managé)
- Fichiers : Supabase Storage (CDN)

## ✅ Checklist de Migration

- [x] **Frontend**

  - [x] Migration Vue.js → Next.js
  - [x] Conservation du design
  - [x] Adaptation des composants
  - [x] Migration des hooks/composables

- [x] **Backend**

  - [x] Migration Rails → Next.js API Routes
  - [x] Conservation de toutes les routes
  - [x] Migration des modèles de données

- [x] **Base de Données**

  - [x] Configuration Prisma
  - [x] Migration du schéma
  - [x] Configuration Supabase

- [x] **Authentification**

  - [x] Migration vers JWT + cookies
  - [x] Protection des routes
  - [x] Gestion des sessions

- [x] **Upload de Fichiers**

  - [x] Configuration Supabase Storage
  - [x] Migration des composants d'upload
  - [x] Gestion des permissions

- [x] **Tests & Validation**
  - [x] Tests des fonctionnalités principales
  - [x] Validation de l'authentification
  - [x] Tests CRUD des recommandations

## 🎯 Résultats

### Avantages Obtenus

- ✅ **Monorepo** : Un seul projet à maintenir
- ✅ **Performance** : Next.js optimisé pour la production
- ✅ **SEO** : Server Components pour un meilleur référencement
- ✅ **Sécurité** : Authentification renforcée avec JWT
- ✅ **Scalabilité** : Supabase pour la base de données et les fichiers
- ✅ **DX** : Meilleure expérience développeur avec TypeScript end-to-end

### Fonctionnalités Conservées

- ✅ Toutes les fonctionnalités CRUD
- ✅ Design et UX identiques
- ✅ Responsive design
- ✅ Authentification utilisateur
- ✅ Upload de fichiers
- ✅ Catégorisation des recommandations
- ✅ Navigation et routage

## 📝 Notes Importantes

1. **Variables d'environnement** : Configurer Supabase avant le premier déploiement
2. **Migration des données** : Exécuter le script de migration si nécessaire
3. **Tests** : Tester toutes les fonctionnalités après migration
4. **Monitoring** : Configurer le monitoring Supabase et Vercel
5. **Backup** : Sauvegarder l'ancienne base de données avant migration

---

**Migration réalisée avec succès** ✅  
**Toutes les fonctionnalités préservées** ✅  
**Performance et sécurité améliorées** ✅
