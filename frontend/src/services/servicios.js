import api from './api'

// CRUD servicios
export const listarServicios = () => api.get('/servicios').then(r => r.data)
export const agregarServicio = (datos) => api.post('/servicios', datos).then(r => r.data)
export const editarServicio = (id, datos) => api.put(`/servicios/${id}`, datos).then(r => r.data)
export const eliminarServicio = (id) => api.delete(`/servicios/${id}`).then(r => r.data)
