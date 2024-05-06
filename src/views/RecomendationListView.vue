<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useHomeService from '../services/recomendation'
import RecomendationCard from '@/components/recomendation/RecomendationCard.vue'
import RecomendationModal from '@/components/recomendation/RecomendationModal.vue'
import RecomendationAddButton from '@/components/recomendation/RecomendationAddButton.vue'
import HeaderApp from '@/components/HeaderApp.vue'

const recomendations = ref([])

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
  console.log('handleRecomendationModal')
  openModal()
}

onMounted(fetchRecomendations)
</script>

<template>
  <HeaderApp />
  <section
    :class="{ 'opacity-80 overflow-hidden select-none': isModalOpen }"
    class="flex flex-wrap justify-between gap-2 m-10"
  >
    <RecomendationCard />

    <RecomendationAddButton @click="handleRecomendationModal" />

    <RecomendationModal v-if="isModalOpen" />
  </section>
</template>

<style scoped></style>
