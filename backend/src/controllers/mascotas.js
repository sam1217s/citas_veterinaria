import Mascota from '../models/Mascota.js'

// Listar
export const listar = async (req, res) => {
  try {
    res.json(await Mascota.find().sort({ createdAt: -1 }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Agregar
export const agregar = async (req, res) => {
  try {
    res.status(201).json(await Mascota.create(req.body))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Editar
export const editar = async (req, res) => {
  try {
    res.json(await Mascota.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }))
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Eliminar
export const eliminar = async (req, res) => {
  try {
    await Mascota.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Mascota eliminada' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
