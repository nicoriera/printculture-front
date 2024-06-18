import { createRouter, createWebHistory } from 'vue-router'

// Exemple de fonction pour vérifier l'état de connexion
function isAuthenticated() {
  return !!localStorage.getItem('authToken') // Vous pouvez adapter ceci à votre logique d'authentification
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/recomendations',
    name: 'recomendations',
    component: () => import('../views/RecomendationListView.vue'),
    meta: { requiresAuth: true } // Ajout de meta pour indiquer que cette route nécessite une authentification
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Cette route nécessite une authentification, vérifiez l'état de connexion
    if (!isAuthenticated()) {
      // Utilisateur non connecté, redirigez-le vers la page de connexion
      next({ name: 'login' })
    } else {
      // Utilisateur connecté, permettez l'accès
      next()
    }
  } else {
    // Route ne nécessitant pas d'authentification, permettez l'accès
    next()
  }
})

export default router
