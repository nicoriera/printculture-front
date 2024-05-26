import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API_URL
const apiUrlLocal = import.meta.env.VITE_APP_API_URL_LOCAL

const api = axios.create({
  baseURL: apiUrlLocal || apiUrl,
  timeout: 5000
})

export default api
