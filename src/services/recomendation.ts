import api from '../api/index'

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
      const response = await api.get(`/api/v1/recommendations`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const addRecommendation = async (data: IRecommendation) => {
    try {
      const response = await api.post(`/api/v1/recommendations`, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const deleteRecommendation = async (id: number) => {
    try {
      const response = await api.delete(`/api/v1/recommendations/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch spaces')
    }
  }

  const updateRecommendation = async (data: IRecommendation) => {
    try {
      const response = await api.put(`/api/v1/recommendations/${data.id}`, data)
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
