import api from './api'

// CRUD citas
export const listarCitas = () => api.get('/citas').then(r => r.data)
export const agregarCita = (datos) => api.post('/citas', datos).then(r => r.data)
export const editarCita = (id, datos) => api.put(`/citas/${id}`, datos).then(r => r.data)
export const eliminarCita = (id) => api.delete(`/citas/${id}`).then(r => r.data)
