import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recomendations',
      name: 'recomendation',
      component: () => import('../views/RecomendationListView.vue')
    }
  ]
})

export default router
