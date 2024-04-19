import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/recomendations',
      name: 'recomendation',
      component: () => import('../views/RecomendationListView.vue')
    }
  ]
})

export default router
