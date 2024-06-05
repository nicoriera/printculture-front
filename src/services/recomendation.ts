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
      const response = await fetch(`${apiUrl}/recommendations`)
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText)
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
      const response = await api.post(`${apiUrl}/recommendations`, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const deleteRecommendation = async (id: number) => {
    try {
      const response = await api.delete(`${apiUrl}/recommendations/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const updateRecommendation = async (data: IRecommendation) => {
    try {
      const response = await api.put(`${apiUrl}/recommendations${data.id}`, data)
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
