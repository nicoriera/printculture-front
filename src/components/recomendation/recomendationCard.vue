<script setup lang="ts">
import useHomeService, { type IRecommendation } from '@/services/recomendation'
import { onMounted, ref, watchEffect } from 'vue'

const recomendations = ref([])

const getCardColorByCategory = (category: string) => {
  switch (category) {
    case 'Movie':
      return 'bg-red-200 bg-opacity-40'
    case 'Book':
      return 'bg-blue-200 bg-opacity-40'
    case 'Music':
      return 'bg-green-200 bg-opacity-40'
    case 'Podcast':
      return 'bg-yellow-200 bg-opacity-40'
    default:
      return 'bg-gray-200 bg-opacity-40'
  }
}

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
    recomendations.value = recomendations.value.filter((m) => m.id !== movie.id)
  } catch (error) {
    console.error(error)
  }
}

watchEffect(() => {
  console.log('recomendations', recomendations.value)
})

onMounted(fetchRecomendations)
</script>

<template>
  <div
    v-for="movie in recomendations"
    :key="(movie as IRecommendation)?.title"
    :class="getCardColorByCategory((movie as IRecommendation)?.category ?? '')"
    class="flex-auto w-1/3 movie-card border-1 rounded-xl inline-flex flex-col p-6 m-2 border-black hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto relative"
  >
    <div class="flex gap-2 items-center">
      <p class="text-gray-600">{{ (movie as IRecommendation)?.category }}</p>
      <p class="text-gray-500 text-sm border-2 rounded-lg p-1 bg-gray-50">
        {{ (movie as IRecommendation)?.tag }}
      </p>
    </div>
    <div class="my-2">
      <h3 class="font-medium text-lg">{{ (movie as IRecommendation)?.title }}</h3>
      <p class="text-gray-700 truncate">{{ (movie as IRecommendation)?.description }}</p>
    </div>
    <div class="flex-row flex justify-between">
      <a
        target="_blank"
        :href="(movie as IRecommendation)?.link"
        class="text-gray-500 truncate hover:text-blue-400 cursor-pointer"
        >Link
      </a>
    </div>

    <div class="flex gap-2 mt-2 absolute right-2 top-0">
      <button class="bg-blue-600 h-4 w-4 rounded-full cursor-pointer hover:bg-blue-700"></button>
      <button
        class="bg-red-600 h-4 w-4 rounded-full cursor-pointer hover:bg-red-700"
        @click="fetchDeleteRecomendation(movie)"
      ></button>
    </div>
  </div>
</template>
