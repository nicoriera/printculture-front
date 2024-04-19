<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useHomeService, { type IRecommendation } from '../services/recomendation'
import recomendationCard from '../components/recomendation/recomendationCard.vue'
import HeaderApp from '@/components/headerApp.vue'

const apiResponse = ref([])

const fetchRecomendations = async () => {
  try {
    const homeService = useHomeService() // Appel de la fonction useHomeService avec l'argument 'apiEndpoint'
    const data = await homeService.getRecommendations() // Appel de la méthode getSpaces sur l'objet retourné par useHomeService
    apiResponse.value = data
  } catch (error) {
    console.error(error)
  }
}

const fetchAddRecomendation = async () => {
  try {
    const homeService = useHomeService() // Appel de la fonction useHomeService avec l'argument 'apiEndpoint'
    const recomendation = {
      title: title.value,
      description: description.value
    }
    const data = await homeService.addRecommendation(recomendation) // Appel de la méthode getSpaces sur l'objet retourné par useHomeService
    apiResponse.value = data
  } catch (error) {
    console.error(error)
  }
}

const fetchDeleteRecomendation = async (movie: IRecommendation) => {
  try {
    const homeService = useHomeService()
    await homeService.deleteRecommendation(movie.id) // Supprimer la recommandation en utilisant l'ID de la carte
    await fetchRecomendations() // Récupérer à nouveau les données après la suppression
  } catch (error) {
    console.error(error)
  }
}

const fetchUpdateData = async (movie: IRecommendation) => {
  try {
    const homeService = useHomeService()
    await homeService.updateRecommendation(movie.id, movie) // Mettre à jour la recommandation en utilisant l'ID de la carte
    await fetchRecomendations() // Récupérer à nouveau les données après la mise à jour
  } catch (error) {
    console.error(error)
  }
}

const title = ref('')
const description = ref('')
const editingMovie = ref()

const updateData = (movie: any) => {
  editingMovie.value = { ...movie }
  title.value = movie.title
  description.value = movie.description
}

const submitUpdate = async () => {
  if (editingMovie.value) {
    const updatedMovie = {
      ...editingMovie.value,
      title: title.value,
      description: description.value
    }
    const homeService = useHomeService()
    const data = await homeService.updateRecommendation(updatedMovie)
    apiResponse.value = data
    editingMovie.value = null
  }
}

onMounted(fetchRecomendations)
</script>

<template>
  <HeaderApp />
  <section class="flex flex-wrap justify-between gap-2 m-16">
    <div
      class="flex-auto h-28 movie-card my-2 border inline-flex flex-col p-4 border-gray-200 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto"
      v-for="movie in apiResponse"
      :key="movie?.id"
    >
      <h3 class="font-medium mr-2">{{ movie?.title }}</h3>
      <p class="text-gray-500 truncate">{{ movie?.description }}</p>
      <div class="flex gap-2 mt-2">
        <button
          class="bg-blue-600 h-4 w-4 rounded-full cursor-pointer hover:bg-blue-700"
          @click="updateData(movie)"
        ></button>
        <button
          class="bg-red-600 h-4 w-4 rounded-full cursor-pointer hover:bg-red-700"
          @click="fetchDeleteRecomendation(movie)"
        ></button>
      </div>
    </div>
    <div>
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-24 h-24"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <form
      class="hidden my-2 hover:bg-orange-200 p-2 shadow-sm border border-gray-200 rounded-lg"
      @submit.prevent="editingMovie.value ? submitUpdate : fetchAddRecomendation"
    >
      <div class="mb-2">
        <label for="">Title</label>
        <input
          type="text"
          class="w-full p-2 border border-gray-200 rounded-md"
          placeholder="Add a title"
          v-model="title"
        />
      </div>
      <div class="mb-2">
        <label for="">Description</label>
        <textarea
          class="w-full p-2 border border-gray-200 rounded-md"
          placeholder="Add a description"
          v-model="description"
        ></textarea>
      </div>
      <button
        class="w-full p-2 mt-2 text-white rounded-md hover:bg-orange-600 transition duration-300 ease-in-out"
      >
        {{ editingMovie?.value ? 'Update movie' : 'Add movie' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
/* Styles for when card is being dragged */
.movie-card[draggable='true']:hover {
  cursor: grab;
}

.movie-card[draggable='true']:active {
  cursor: grabbing;
}

.movie-card[draggable='true'].dragged {
  opacity: 0.5;
  pointer-events: none;
}
</style>
