<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import useHomeService from '../services/recomendation'
import type { IRecommendation } from '../types/recommendation'
import { useRouter } from 'vue-router'

// Définir les variables manquantes
const recommendations = ref<IRecommendation[]>([])
const isModalOpen = ref(false)

const title = ref('')
const description = ref('')
const tag = ref('')
const category = ref('')
const link = ref('')
const videoLink = ref('')

const isMobile = ref(window.innerWidth < 768)

const router = useRouter()

onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})

// Function to toggle body scroll
const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Watch for changes in isModalOpen
watch(isModalOpen, (newValue) => {
  toggleBodyScroll(newValue)
})

const fetchAddRecommendation = async () => {
  try {
    const homeService = useHomeService()
    // Add your recommendation logic here
    await homeService.addRecommendation({
      title: title.value,
      description: description.value,
      tag: tag.value,
      category: category.value,
      link: link.value,
      videoLink: videoLink.value
    })
  } catch (error) {
    console.error('Error adding recommendation:', error)
  }
}

// Somewhere in your component's logic or lifecycle hook
onMounted(async () => {
  await fetchAddRecommendation()
})

const resetForm = () => {
  title.value = ''
  description.value = ''
  tag.value = ''
  category.value = ''
  link.value = ''
  videoLink.value = ''
  isModalOpen.value = false
}

const handleRecommendationModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

// Ajoutez ici les autres fonctions nécessaires comme goToRecommendation, fetchDeleteRecommendation, etc.
const goToRecommendation = (recommendation: IRecommendation) => {
  router.push({ name: 'recommendationDetails', params: { id: recommendation.id } })
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
// Vous devrez probablement ajouter une fonction pour charger les recommandations initiales
const fetchRecommendations = async () => {
  try {
    const homeService = useHomeService()
    recommendations.value = await homeService.getRecommendations()
  } catch (error) {
    console.error(error)
  }
}

const fetchDeleteRecommendation = async (recommendation: IRecommendation) => {
  console.log(recommendation)
  try {
    const homeService = useHomeService()
    await homeService.deleteRecommendation(recommendation.id ?? 0)
    recommendations.value = recommendations.value.filter((r) => r.id !== recommendation.id)
  } catch (error) {
    console.error(error)
  }
}

// Appelez cette fonction au chargement du composant
fetchRecommendations()

const handleAddRecommendation = async () => {
  await fetchAddRecommendation()
  await fetchRecommendations()
  resetForm()
}
</script>

<template>
  <div class="w-full pt-14" :class="{ 'overflow-hidden': isModalOpen }">
    <section class="flex flex-col gap-4 p-4 dark:bg-gray-900 min-h-screen">
      <!-- Bouton d'ajout pour mobile (en haut de la liste) -->
      <button
        v-if="isMobile && !isModalOpen"
        @click="handleRecommendationModal"
        class="bg-blue-500 text-white rounded-lg py-3 px-4 mb-4 hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Recommendation
      </button>

      <!-- Liste des recommandations -->
      <div
        v-for="movie in recommendations"
        :key="movie.id"
        :class="[getCardColorByCategory(movie.category ?? ''), 'rounded-xl p-4 shadow-md']"
      >
        <div class="flex justify-between items-center mb-2">
          <p class="text-gray-600 font-semibold">{{ movie.category }}</p>
          <p class="text-gray-500 text-sm border rounded-lg p-1 bg-gray-50">
            {{ movie.tag }}
          </p>
        </div>
        <h3 class="font-medium text-lg mb-2">{{ movie.title }}</h3>
        <p class="text-gray-700 mb-2 line-clamp-2">{{ movie.description }}</p>
        <div v-if="movie.videoLink" class="mb-2">
          <iframe
            :src="movie.videoLink"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-48"
          ></iframe>
        </div>
        <a :href="movie.link" target="_blank" class="text-blue-500 hover:text-blue-700 block mb-2">
          View Link
        </a>
        <div class="flex justify-between items-center">
          <button @click="goToRecommendation(movie)" class="text-blue-500 hover:text-blue-700">
            Details
          </button>
          <button
            @click.stop="fetchDeleteRecommendation(movie)"
            class="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Modal d'ajout (modifiée pour mobile et fixation du fond) -->
      <div
        v-if="isModalOpen"
        id="modal-add-recommendation"
        :class="[
          'fixed inset-x-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out',
          isMobile
            ? 'bottom-0 h-2/3 rounded-t-3xl'
            : 'inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        ]"
      >
        <div
          :class="[
            isMobile ? 'h-full overflow-y-auto p-6' : 'bg-white rounded-xl p-6 w-full max-w-md'
          ]"
        >
          <form @submit.prevent="handleAddRecommendation" class="flex flex-col gap-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Add recommendation</h2>
              <button @click="closeModal" type="button" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="flex flex-col gap-2">
              <label for="category" class="font-medium">Category</label>
              <select v-model="category" class="border rounded-lg px-3 py-2">
                <option value="Movie">Movie</option>
                <option value="Book">Book</option>
                <option value="Music">Music</option>
                <option value="Podcast">Podcast</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label for="tag" class="font-medium">Tag</label>
              <input v-model="tag" type="text" class="border rounded-lg px-3 py-2" />
            </div>

            <div class="flex flex-col gap-2">
              <label for="title" class="font-medium">Title</label>
              <input v-model="title" type="text" class="border rounded-lg px-3 py-2" />
            </div>

            <div class="flex flex-col gap-2">
              <label for="description" class="font-medium">Description</label>
              <textarea
                v-model="description"
                rows="3"
                class="border rounded-lg px-3 py-2"
              ></textarea>
            </div>

            <div class="flex flex-col gap-2">
              <label for="link" class="font-medium">Link</label>
              <input v-model="link" type="text" class="border rounded-lg px-3 py-2" />
            </div>

            <div class="flex flex-col gap-2">
              <label for="videoLink" class="font-medium">Video Link</label>
              <input
                v-model="videoLink"
                type="text"
                class="border rounded-lg px-3 py-2"
                placeholder="https://www.youtube.com/embed/your-video-id"
              />
            </div>

            <button
              type="submit"
              class="bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition duration-300 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add recommendation
            </button>
          </form>
        </div>
      </div>

      <!-- Bouton d'ajout pour desktop (fixe en bas à droite) -->
      <button
        v-if="!isMobile && !isModalOpen"
        @click="handleRecommendationModal"
        class="fixed bottom-4 right-4 z-40 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </section>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
