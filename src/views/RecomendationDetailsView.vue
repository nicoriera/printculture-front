<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useHomeService from '../services/recomendation'
import type { IRecommendation } from '../types/recommendation'

const router = useRouter()
const route = useRoute()
const recommendation = ref<IRecommendation | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  const homeService = useHomeService()
  try {
    recommendation.value = await homeService.getRecommendationById(id)
  } catch (error) {
    console.error('Error fetching recommendation details:', error)
  }
})

const goBack = () => {
  router.push('/recomendations')
}

const getCardColorByCategory = (category: string) => {
  switch (category) {
    case 'Movie':
      return 'bg-blue-200'
    case 'Book':
      return 'bg-green-200'
    case 'Music':
      return 'bg-red-200'
    case 'Podcast':
      return 'bg-yellow-200'
    default:
      return 'bg-gray-200'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 pt-14">
    <div class="max-w-2xl mx-auto p-4">
      <button @click="goBack" class="mb-4 text-blue-500 hover:text-blue-700 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to List
      </button>

      <div
        v-if="recommendation"
        :class="[getCardColorByCategory(recommendation.category || ''), 'rounded-xl p-6 shadow-md']"
      >
        <h1 class="text-2xl font-bold mb-4">{{ recommendation.title }}</h1>
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600 font-semibold">{{ recommendation.category }}</p>
          <p class="text-gray-500 text-sm border rounded-lg p-1 bg-white">
            {{ recommendation.tag }}
          </p>
        </div>
        <p class="mb-4 text-gray-700">{{ recommendation.description }}</p>
        <a
          :href="recommendation.link"
          target="_blank"
          class="text-blue-500 hover:text-blue-700 underline mb-4 block"
        >
          View Link
        </a>
        <div class="mt-4">
          <p class="text-gray-600">Video</p>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/j3CFj1R9HbQ?si=RHABsgbB1XVZr6sN"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            class="w-full h-64 md:h-96 rounded-lg"
          ></iframe>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-600">Loading recommendation details...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
