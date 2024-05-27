import api from '../api/index'

const apiUrl = import.meta.env.VITE_APP_API_URL

export interface IRecommendation {
  id?: number
  title?: string
  description?: string
  link?: string
  category?: string
  tag?: string
}
const useHomeService = () => {
  const getRecommendations = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/recommendations`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('Recommendations:', data)

      return data
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const addRecommendation = async (data: IRecommendation) => {
    try {
      const response = await api.post(`${apiUrl}/api/v1/recommendations`, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const deleteRecommendation = async (id: number) => {
    try {
      const response = await api.delete(`${apiUrl}/api/v1/recommendations/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const updateRecommendation = async (data: IRecommendation) => {
    try {
      const response = await api.put(`${apiUrl}/api/v1/recommendations${data.id}`, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to update recommendation')
    }
  }

  return {
    getRecommendations,
    addRecommendation,
    deleteRecommendation,
    updateRecommendation
  }
}

export default useHomeService
