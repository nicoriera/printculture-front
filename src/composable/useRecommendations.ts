import { ref, type Ref } from 'vue'
import type { IRecommendation } from '@/types/recommendation'
import useHomeService from '@/services/recomendation'

export default function useRecommendations() {
  const recommendations: Ref<IRecommendation[]> = ref([])
  const isModalOpen = ref(false)

  const addRecommendation = async (recommendation: IRecommendation) => {
    try {
      const homeService = useHomeService()
      const data = await homeService.addRecommendation(recommendation)
      recommendations.value.push(data)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteRecommendation = async (recommendation: IRecommendation) => {
    try {
      const homeService = useHomeService()
      await homeService.deleteRecommendation(recommendation.id)
      recommendations.value = recommendations.value.filter((r) => r.id !== recommendation.id)
    } catch (error) {
      console.error(error)
    }
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  return {
    recommendations,
    addRecommendation,
    deleteRecommendation,
    isModalOpen,
    openModal,
    closeModal
  }
}
