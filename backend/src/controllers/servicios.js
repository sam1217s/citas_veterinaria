import Servicio from '../models/Servicio.js'

// Listar
export const listar = async (req, res) => {
  try {
    res.json(await Servicio.find().sort({ nombre: 1 }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Agregar
export const agregar = async (req, res) => {
  try {
    const { nombre, duracion, activo } = req.body
    res.status(201).json(await Servicio.create({ nombre, duracion, activo }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Editar
export const editar = async (req, res) => {
  try {
    const { nombre, duracion, activo } = req.body
    res.json(await Servicio.findByIdAndUpdate(req.params.id, { nombre, duracion, activo }, { returnDocument: 'after' }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Eliminar
export const eliminar = async (req, res) => {
  try {
    await Servicio.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Servicio eliminado' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
