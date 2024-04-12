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

  const addRecommendation = async (data) => {
    try {
      const response = await api.post(`/api/v1/recommendations`, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const deleteRecommendation = async (id) => {
    try {
      const response = await api.delete(`/api/v1/recommendations/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  return {
    getRecommendations,
    addRecommendation,
    deleteRecommendation
  }
}

export default useHomeService
