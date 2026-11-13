import Mascota from '../models/Mascota.js'
import Cita from '../models/Cita.js'
import Usuario from '../models/Usuario.js'
import Servicio from '../models/Servicio.js'
import { obtenerConfiguracion, aMinutos } from './configuracion.js'

export const correoNoExiste = async (correo) => {
  if (await Usuario.exists({ correo })) throw new Error('El correo ya esta registrado')
}

export const telefonoNoExiste = async (telefono) => {
  if (await Usuario.exists({ telefono })) throw new Error('El telefono ya esta registrado')
}

export const existeMascota = async (id) => {
  if (!(await Mascota.findById(id))) throw new Error('La mascota no existe')
}

export const existeCita = async (id) => {
  if (!(await Cita.findById(id))) throw new Error('La cita no existe')
}

export const mascotaSinCitas = async (id) => {
  if (await Cita.exists({ mascota: id })) throw new Error('La mascota tiene citas registradas')
}

export const existeServicio = async (id) => {
  if (!(await Servicio.findById(id))) throw new Error('El servicio no existe')
}

export const servicioNoRepetido = async (nombre, { req }) => {
  const filtro = { nombre: new RegExp(`^${nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
  if (req.params.id) filtro._id = { $ne: req.params.id }
  if (await Servicio.exists(filtro)) throw new Error('Ya existe un servicio con ese nombre')
}

export const servicioSinCitas = async (id) => {
  if (await Cita.exists({ servicio: id })) throw new Error('El servicio tiene citas registradas, mejor desactivelo')
}

// Horario de atencion y cruce de citas segun la duracion del servicio
export const horarioDisponible = async (hora, { req }) => {
  const { fecha, estado } = req.body
  const servicio = await Servicio.findById(req.body.servicio)
  if (!servicio) return true

  const config = await obtenerConfiguracion()
  const inicio = aMinutos(hora)
  const fin = inicio + servicio.duracion
  const actual = req.params.id ? await Cita.findById(req.params.id) : null
  const cambioHorario = !actual || actual.fecha !== fecha || actual.hora !== hora || String(actual.servicio) !== String(servicio._id)

  if (cambioHorario) {
    if (!servicio.activo) throw new Error('El servicio no esta activo')
    const dia = config.horario.find(h => h.dia === new Date(`${fecha}T00:00:00`).getDay())
    if (!dia?.activo) throw new Error('El negocio no atiende ese dia')
    if (inicio < aMinutos(dia.inicio) || fin > aMinutos(dia.fin)) {
      throw new Error(`El servicio dura ${servicio.duracion} min y ese dia se atiende de ${dia.inicio} a ${dia.fin}`)
    }
    if (new Date(`${fecha}T${hora}:00`) < new Date()) throw new Error('No se puede agendar en una fecha u hora pasada')
  }

  if (estado !== 'cancelada') {
    const filtro = { fecha, estado: { $ne: 'cancelada' } }
    if (actual) filtro._id = { $ne: actual._id }
    const citas = await Cita.find(filtro)
    const cruce = citas.find(c => inicio < aMinutos(c.hora) + c.duracion && aMinutos(c.hora) < fin)
    if (cruce) throw new Error(`Se cruza con otra cita de ${cruce.hora} (${cruce.duracion} min)`)
  }
}
