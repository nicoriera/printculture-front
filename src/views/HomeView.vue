<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useHomeService from '../services/home'

const apiResponse = ref([])
const draggedMovie = ref()

const fetchData = async () => {
  try {
    const homeService = useHomeService() // Appel de la fonction useHomeService avec l'argument 'apiEndpoint'
    const data = await homeService.getRecommendations() // Appel de la méthode getSpaces sur l'objet retourné par useHomeService
    apiResponse.value = data
  } catch (error) {
    console.error(error)
  }
}

const addData = async () => {
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

const deleteData = async (movie: any) => {
  try {
    const homeService = useHomeService()
    await homeService.deleteRecommendation(movie.id) // Supprimer la recommandation en utilisant l'ID de la carte
    await fetchData() // Récupérer à nouveau les données après la suppression
  } catch (error) {
    console.error(error)
  }
}

const title = ref('')
const description = ref('')

const onDragStart = (movie: any, event: DragEvent) => {
  draggedMovie.value = movie
  console.log('Dragged movie:', movie)
  event.dataTransfer?.setData('application/json', JSON.stringify(movie))
}

const onDrop = (event: any) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  console.log(event.dataTransfer, 'event.dataTransfer')

  console.log('Dropped data:', data)

  if (data) {
    try {
      const movie = JSON.parse(data)
      console.log(movie)
    } catch (error) {
      console.error('Error parsing JSON:', error)
    }
  } else {
    console.error('No data found in event.dataTransfer')
  }
}

const onDragEnd = () => {
  // Ne nécessite pas d'argument
}

onMounted(fetchData)
</script>

<template>
  <header class="h-16">PRINTCULTURE</header>
  <section class="grid grid-cols-5 gap-4">
    <div
      class="col-start-1 col-end-5 movie-card my-2 border inline-flex flex-col p-4 border-gray-200 rounded-lg shadow-sm bg-blue-100 hover:bg-blue-200 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto"
      v-for="movie in apiResponse"
      :key="movie?.id"
      draggable="true"
      @dragstart="onDragStart(movie, $event)"
      @dragend="onDragEnd"
    >
      <h3 class="font-medium mr-2">{{ movie?.title }}</h3>
      <p class="text-gray-500 truncate">{{ movie?.description }}</p>
      <button
        class="bg-red-600 h-4 w-4 rounded-full cursor-pointer hover:bg-red-700"
        @click="deleteData(movie)"
      ></button>
    </div>

    <form
      class="fixed right-0 col-start-5 col-end-7 row-start-1 row-end-4 my-2 bg-orange-200 p-2 shadow-sm border border-orange-300 rounded-lg"
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
        class="w-full p-2 mt-2 bg-orange-400 text-white rounded-md hover:bg-orange-600 transition duration-300 ease-in-out"
        @click="addData"
      >
        Add movie
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
