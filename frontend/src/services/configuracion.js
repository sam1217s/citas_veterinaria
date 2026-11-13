import api from './api'

export const obtenerConfiguracion = () => api.get('/configuracion').then(r => r.data)
export const guardarConfiguracion = (datos) => api.put('/configuracion', datos).then(r => r.data)
