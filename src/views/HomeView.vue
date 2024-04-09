<template>
  <header>
    <h1 class="mb-4">Home</h1>
    <p class="mb-4">Drag and drop a movie to the list on the right</p>
    <div
      class="drop-zone border border-dashed rounded-md"
      @dragenter.prevent
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      Drop Zone
    </div>

    <div>
      <div
        class="movie-card my-2 mr-2 border inline-flex flex-col p-4 border-gray-200 rounded-lg shadow-sm bg-blue-100 hover:bg-blue-200 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
        v-for="movie in apiResponse"
        :key="movie?.id"
        draggable="true"
        @dragstart="onDragStart(movie, $event)"
        @dragend="onDragEnd"
      >
        <h3 class="font-medium mr-2">{{ movie?.title }}</h3>
        <p class="text-gray-500">{{ movie?.description }}</p>
      </div>
    </div>
  </header>
</template>

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
