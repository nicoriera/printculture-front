<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useHomeService from '../services/recomendation'
import RecomendationCard from '@/components/recomendation/RecomendationCard.vue'
import RecomendationModal from '@/components/recomendation/RecomendationModal.vue'
import RecomendationAddButton from '@/components/recomendation/RecomendationAddButton.vue'
import HeaderApp from '@/components/HeaderApp.vue'

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

const openModal = () => {
  const modal = document.getElementById('modal-add-recomendation')
  modal?.classList.add('open')
}

const handleRecomendationModal = () => {
  console.log('handleRecomendationModal')
  openModal()
}

onMounted(fetchRecomendations)
</script>

<template>
  <HeaderApp />
  <section class="flex flex-wrap justify-between gap-2 m-16">
    <RecomendationCard />

    <RecomendationAddButton @click="handleRecomendationModal" />

    <RecomendationModal />
  </section>
</template>

<style scoped></style>
