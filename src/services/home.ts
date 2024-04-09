import api from '../api/index'
const useHomeService = () => {
  const getRecommendations = async () => {
    try {
      const response = await api.get(`/api/v1/recommendations`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  return {
    getRecommendations
  }
}

export default useHomeService
