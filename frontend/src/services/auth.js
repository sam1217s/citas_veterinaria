import api from './api'

export const login = (datos) => api.post('/auth/login', datos).then(r => r.data)
export const registro = (datos) => api.post('/auth/registro', datos).then(r => r.data)
