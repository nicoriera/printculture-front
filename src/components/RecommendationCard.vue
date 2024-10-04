<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { IRecommendation } from '../types/recommendation'

const props = defineProps<{
  recommendation: IRecommendation
}>()

const emit = defineEmits<{
  (e: 'delete', recommendation: IRecommendation): void
  (e: 'click', recommendation: IRecommendation): void
}>()

const getCardColorByCategory = (category: string) => {
  // Implémentez la logique pour obtenir la couleur de la carte en fonction de la catégorie
  // Par exemple :
  const colors = {
    Movie: 'bg-blue-100',
    Book: 'bg-green-100',
    Music: 'bg-yellow-100',
    Podcast: 'bg-purple-100'
  }
  return colors[category] || 'bg-gray-100'
}

const hideButtonDeleteOnScroll = () => {
  // Implémentez la logique pour masquer le bouton de suppression lors du défilement
}
</script>

<template>
  <div
    @click="$emit('click', recommendation)"
    :class="getCardColorByCategory(recommendation.category)"
    class="gap-2 cursor-pointer h-full w-full border-1 rounded-xl inline-flex md:flex-col items-center p-4 md:p-6 md:m-2 border-black hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto relative"
  >
    <div class="inline-flex md:w-full gap-2 items-center">
      <p class="text-gray-600">{{ recommendation.category }}</p>
      <p class="text-gray-500 text-sm border-2 hidden md:inline-flex rounded-lg p-1 bg-gray-50">
        {{ recommendation.tag }}
      </p>
    </div>
    <div class="w-full md:my-2">
      <h3 class="font-medium truncate text-lg">
        {{ recommendation.title }}
      </h3>
      <p class="text-gray-700 hidden md:inline-flex truncate">
        {{ recommendation.description }}
      </p>
    </div>
    <div v-if="recommendation.videoLink" class="w-full md:my-2">
      <iframe
        :src="recommendation.videoLink"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-64 md:h-96"
      ></iframe>
    </div>
    <div class="w-full hidden md:inline-flex">
      <a
        :href="recommendation.link"
        target="_blank"
        class="text-gray-500 truncate hover:text-blue-400 cursor-pointer"
      >
        Link : {{ recommendation.link }}
      </a>
    </div>
    <div id="button-delete-recommendation" class="flex gap-2 mt-2 absolute right-2 top-0">
      <button
        class="bg-red-600 h-3 md:h-4 w-3 md:w-4 rounded-full cursor-pointer hover:bg-red-700"
        @click.stop="$emit('delete', recommendation)"
        type="button"
        @scroll="hideButtonDeleteOnScroll"
      ></button>
    </div>
  </div>
</template>
