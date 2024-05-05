<script setup lang="ts">
import useHomeService, { type IRecommendation } from '@/services/recomendation'
import { onMounted, ref, watch } from 'vue'

const recomendations = ref([])

const fetchRecomendations = async () => {
  try {
    const homeService = useHomeService()
    const data = await homeService.getRecommendations()
    recomendations.value = data
  } catch (error) {
    console.error(error)
  }
}

const fetchDeleteRecomendation = async (movie: IRecommendation) => {
  try {
    const homeService = useHomeService()
    await homeService.deleteRecommendation(movie.id!)
  } catch (error) {
    console.error(error)
  }
}

watch(
  recomendations,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await fetchRecomendations()
    }
  },
  { deep: true }
)

onMounted(fetchRecomendations)
</script>

<template>
  <div
    v-for="movie in recomendations"
    :key="(movie as IRecommendation)?.title"
    class="flex-auto w-1/3 movie-card border-2 inline-flex flex-col p-4 border-black hover:bg-blue-50 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto"
  >
    <h3 class="font-medium mr-2">{{ (movie as IRecommendation)?.title }}</h3>
    <p class="text-gray-500 truncate">{{ (movie as IRecommendation)?.description }}</p>
    <div class="flex gap-2 mt-2">
      <button class="bg-blue-600 h-4 w-4 rounded-full cursor-pointer hover:bg-blue-700"></button>
      <button
        class="bg-red-600 h-4 w-4 rounded-full cursor-pointer hover:bg-red-700"
        @click="fetchDeleteRecomendation(movie)"
      ></button>
    </div>
  </div>
</template>
