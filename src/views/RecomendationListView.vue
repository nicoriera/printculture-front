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

const title = ref('')
const description = ref('')
const tag = ref('')
const category = ref('')
const link = ref('')

const resetForm = () => {
  title.value = ''
  description.value = ''
  tag.value = ''
  category.value = ''
  link.value = ''
}

const fetchAddRecomendation = async () => {
  try {
    const homeService = useHomeService()
    const recomendation = {
      title: title.value,
      description: description.value,
      tag: tag.value,
      category: category.value,
      link: link.value
    }
    const data = await homeService.addRecommendation(recomendation)
    recomendations.value.push(data as never)
    resetForm()
  } catch (error) {
    console.error(error)
  }
}

// Hide button on scroll
let lastScrollPosition = 0

const hideButtonAddRecomendationOnScroll = () => {
  const button = document.getElementById('button-add-recomendation')
  if (button) {
    window.addEventListener(
      'scroll',
      () => {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
        if (currentScrollPosition > lastScrollPosition) {
          button.classList.add('hidden')
        } else {
          button.classList.remove('hidden')
        }
        lastScrollPosition = currentScrollPosition <= 0 ? 0 : currentScrollPosition // For Mobile or negative scrolling
      },
      false
    )
  }
}

let lastScrollPositionDeleteButton = 0
const hideButtonnDeleteOnScroll = () => {
  const button = document.getElementById('button-delete-recomendation')
  if (button) {
    window.addEventListener(
      'scroll',
      () => {
        const currentScrollPosition = window.pageXOffset || document.documentElement.scrollLeft
        if (currentScrollPosition > lastScrollPositionDeleteButton) {
          button.classList.add('hidden')
        } else {
          button.classList.remove('hidden')
        }
        lastScrollPositionDeleteButton = currentScrollPosition <= 0 ? 0 : currentScrollPosition // For Mobile or negative scrolling
      },
      false
    )
  }
}

onMounted(() => {
  hideButtonAddRecomendationOnScroll()
  hideButtonnDeleteOnScroll()
})

const handleAddRecomendation = (event: Event) => {
  event.preventDefault()
  fetchAddRecomendation()
  closeModal()
}

const fetchDeleteRecomendation = async (movie: IRecommendation) => {
  try {
    const homeService = useHomeService()
    await homeService.deleteRecommendation(movie.id!)
    recomendations.value = recomendations.value.filter((m: IRecommendation) => m.id !== movie.id)
  } catch (error) {
    console.error(error)
  }
}

watchEffect(() => {
  console.log('recomendations', recomendations.value)
})

let isModalOpen = ref(false)

const fetchRecomendations = async () => {
  try {
    const homeService = useHomeService()
    const data = await homeService.getRecommendations()
    recomendations.value = data
  } catch (error) {
    console.error(error)
  }
}

const openModal = () => {
  const modal = document.getElementById('modal-add-recomendation')
  modal?.classList.add('open')
  isModalOpen.value = true
}

const handleRecomendationModal = () => {
  openModal()
}

const closeModal = () => {
  const modal = document.getElementById('modal-add-recomendation')
  modal?.classList.remove('open')
  isModalOpen.value = false
}

onMounted(fetchRecomendations)
</script>

<template>
  <div class="w-wdh">
    <section id="navbar">
      <header class="w-full z-20">
        <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center">
              <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
                >PRINTCULTURE</span
              >
            </a>
            <div class="flex items-center lg:order-2">
              <a
                href="#"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >Log in</a
              >

              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  class="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a
                    href="/"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    >Recomendation</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </section>

    <section
      class="flex flex-col w-dwh h-full md:flex-wrap justify-between gap-2 mx-2 mt-4 md:m-10"
    >
      <div
        v-for="movie in recomendations"
        :key="(movie as IRecommendation)?.title"
        :class="getCardColorByCategory((movie as IRecommendation)?.category ?? '')"
        class="gap-2 h-full w-full border-1 rounded-xl inline-flex md:flex-col items-center p-4 md:p-6 md:m-2 border-black hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto relative"
      >
        <div class="inline-flex md:w-full gap-2 items-center">
          <p class="text-gray-600">{{ (movie as IRecommendation)?.category }}</p>
          <p class="text-gray-500 text-sm border-2 hidden md:inline-flex rounded-lg p-1 bg-gray-50">
            {{ (movie as IRecommendation)?.tag }}
          </p>
        </div>
        <div class="w-full md:my-2">
          <h3 class="font-medium truncate text-lg">
            {{ (movie as IRecommendation)?.title }}
          </h3>
          <p class="text-gray-700 hidden md:inline-flex truncate">
            {{ (movie as IRecommendation)?.description }}
          </p>
        </div>
        <div class="w-full hidden md:inline-flex">
          <a
            target="_blank"
            :href="(movie as IRecommendation)?.link"
            class="text-gray-500 truncate hover:text-blue-400 cursor-pointer"
            >Link : {{ (movie as IRecommendation)?.link }}
          </a>
        </div>

        <div id="button-delete-recomendation" class="flex gap-2 mt-2 absolute right-2 top-0">
          <button
            class="bg-red-600 h-3 md:h-4 w-3 md:w-4 rounded-full cursor-pointer hover:bg-red-700"
            @click="fetchDeleteRecomendation(movie)"
            type="button"
            @scroll="hideButtonnDeleteOnScroll"
          ></button>
        </div>
      </div>

      <div
        v-if="isModalOpen"
        id="modal-add-recomendation"
        class="md:w-2/4 flex p-4 md:m-4 md:shadow-lg md:border-2 md:rounded-2xl md:border-black z-900 fixed top-0 left-0 bg-white h-dvh w-dvw z-50"
        ref="modal"
      >
        <form class="flex-col w-full" action="submit">
          <button
            class="bg-red-500 hover:bg-red-700 h-6 w-6 text-white rounded-full p-2 text-center absolute top-2 right-2"
            @click="closeModal"
            type="button"
          ></button>
          <div class="mt-4">
            <h2>Add recomendation</h2>
            <p class="text-gray-500 text-sm font-light mt-2 mb-4">
              Add a new recomendation to the list. Fill the fields below and click on the button to
              add a new recomendation.
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <div class="inline-flex flex-col gap-1">
              <label for="category">Category</label>
              <select class="border-2 rounded-xl px-2 p-2" type="select" v-model="category">
                <option value="Movie">Movie</option>
                <option value="Book">Book</option>
                <option value="Music">Music</option>
                <option value="Podcast">Podcast</option>
              </select>
            </div>
            <div class="flex-col inline-flex gap-1">
              <label for="tag">Tag</label>
              <input class="border-2 rounded-xl px-2 p-2" type="text" v-model="tag" />
            </div>
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
            <div class="flex-col inline-flex w-full mt-2">
              <label for="link">Link</label>
              <input class="border-2 rounded-xl px-2 p-2" type="text" v-model="link" />
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

      <button
        id="button-add-recomendation"
        v-if="isModalOpen === false"
        @click="handleRecomendationModal"
        @scroll="hideButtonAddRecomendationOnScroll"
        class="fixed bottom-4 right-4 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-16 md:w-24 h-16 md:h-24 cursor-pointer bg-white rounded-full text-blue-500 hover:text-blue-600 shadow-lg"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </section>
  </div>
</template>

<style scoped></style>
