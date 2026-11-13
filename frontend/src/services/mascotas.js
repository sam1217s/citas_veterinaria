import api from './api'

// CRUD mascotas
export const listarMascotas = () => api.get('/mascotas').then(r => r.data)
export const agregarMascota = (datos) => api.post('/mascotas', datos).then(r => r.data)
export const editarMascota = (id, datos) => api.put(`/mascotas/${id}`, datos).then(r => r.data)
export const eliminarMascota = (id) => api.delete(`/mascotas/${id}`).then(r => r.data)
