import Cita from '../models/Cita.js'
import Servicio from '../models/Servicio.js'

// La cita guarda la duracion del servicio al momento de agendar
const datosCita = async ({ mascota, servicio, fecha, hora, motivo, estado }) => {
  const { duracion } = await Servicio.findById(servicio)
  return { mascota, servicio, duracion, fecha, hora, motivo, estado }
}

// Listar
export const listar = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('mascota', 'nombre especie dueno telefono')
      .populate('servicio', 'nombre duracion')
      .sort({ fecha: 1, hora: 1 })
    res.json(citas)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Agregar
export const agregar = async (req, res) => {
  try {
    res.status(201).json(await Cita.create(await datosCita(req.body)))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Editar
export const editar = async (req, res) => {
  try {
    res.json(await Cita.findByIdAndUpdate(req.params.id, await datosCita(req.body), { returnDocument: 'after' }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Eliminar
export const eliminar = async (req, res) => {
  try {
    await Cita.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Cita eliminada' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
