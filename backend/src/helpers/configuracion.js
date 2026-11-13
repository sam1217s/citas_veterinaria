import Configuracion from '../models/Configuracion.js'
import Servicio from '../models/Servicio.js'

const SERVICIOS_INICIALES = [
  { nombre: 'Consulta general', duracion: 30 },
  { nombre: 'Vacunacion', duracion: 15 },
  { nombre: 'Bano', duracion: 30 },
  { nombre: 'Peluqueria y bano', duracion: 60 }
]

// Crea la configuracion y los servicios de ejemplo la primera vez
export const obtenerConfiguracion = async () => {
  const config = (await Configuracion.findOne()) || (await Configuracion.create({}))
  if (!config.serviciosIniciales) {
    if (!(await Servicio.countDocuments())) await Servicio.insertMany(SERVICIOS_INICIALES)
    config.serviciosIniciales = true
    await config.save()
  }
  return config
}

export const aMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export const horarioValido = (horario) => {
  if (new Set(horario.map(h => h.dia)).size !== 7) throw new Error('El horario debe tener los 7 dias')
  if (horario.some(h => h.activo && aMinutos(h.inicio) >= aMinutos(h.fin))) {
    throw new Error('La hora de inicio debe ser menor a la hora de cierre')
  }
  return true
}
