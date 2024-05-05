<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useHomeService from '@/services/recomendation'

let modal = ref(null)
let dragging = ref(false)
let startX = ref(0)
let startY = ref(0)
let elOffX = ref(0)
let elOffY = ref(0)

onMounted(() => {
  modal.value.addEventListener('mousedown', dragStart)
  modal.value.addEventListener('mousemove', drag)
  modal.value.addEventListener('mouseup', dragEnd)
  modal.value.addEventListener('mouseleave', dragEnd)
})

const dragStart = (event) => {
  dragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  elOffX.value = event.target.offsetLeft
  elOffY.value = event.target.offsetTop
}

const drag = (event) => {
  if (!dragging.value) return
  event.target.style.left = elOffX.value + event.clientX - startX.value + 'px'
  event.target.style.top = elOffY.value + event.clientY - startY.value + 'px'
}

const dragEnd = () => {
  dragging.value = false
}

const title = ref('')
const description = ref('')

const recomendations = ref([])

const closeModal = () => {
  const modal = document.getElementById('modal-add-recomendation')
  modal?.classList.remove('open')
}

const resetForm = () => {
  title.value = ''
  description.value = ''
}

const fetchAddRecomendation = async () => {
  try {
    const homeService = useHomeService()
    const recomendation = {
      title: title.value,
      description: description.value
    }
    const data = await homeService.addRecommendation(recomendation)
    recomendations.value.push(data)
    resetForm()
  } catch (error) {
    console.error(error)
  }
}

const handleAddRecomendation = (event: Event) => {
  event.preventDefault()
  fetchAddRecomendation()
  closeModal()
}
</script>

<template>
  <div
    id="modal-add-recomendation"
    class="w-2/4 flex p-4 m-4 shadow-lg border-2 border-black z-100 fixed bg-white"
    ref="modal"
  >
    <form class="flex-col" action="submit">
      <button
        class="bg-red-500 hover:bg-red-700 h-6 w-6 text-white rounded-full p-2 text-center absolute top-2 right-2"
        @click="closeModal"
        type="button"
      ></button>
      <div class="mt-4">
        <h2>Add recomendation</h2>
        <p class="text-gray-500 text-sm font-light mt-2 mb-4">
          Add a new recomendation to the list. Fill the fields below and click on the button to add
          a new recomendation.
        </p>
      </div>
      <div class="my-6">
        <div class="flex-col inline-flex w-full">
          <label for="title">Title</label>
          <input class="border-2 rounded-xl px-2 p-2" type="text" v-model="title" />
        </div>
        <div class="flex-col inline-flex w-full mt-2">
          <label for="description">Description</label>
          <textarea
            cols="5"
            rows="5"
            class="border-2 rounded-xl px-2 p-4"
            type="text"
            v-model="description"
          >
          </textarea>
        </div>
      </div>
      <button
        class="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600 mt-4"
        @click="handleAddRecomendation"
        type="submit"
        value="Add recomendation
      "
      >
        Add recomendation
      </button>
    </form>
  </div>
</template>

<style scoped>
#modal-add-recomendation {
  display: none;
}

#modal-add-recomendation.open {
  display: block;
}
</style>
