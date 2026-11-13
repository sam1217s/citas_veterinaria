import axios from 'axios'
import { obtenerToken, cerrarSesion } from '../helpers/sesion'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

// Enviar token
api.interceptors.request.use((config) => {
  const token = obtenerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token vencido
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    cerrarSesion()
    window.location.hash = '#/login'
  }
  return Promise.reject(error)
})

export const mensajeError = (error) => error.response?.data?.msg || 'No se pudo conectar con el servidor'

export default api
