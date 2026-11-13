import { obtenerConfiguracion } from '../helpers/configuracion.js'

// Ver
export const obtener = async (req, res) => {
  try {
    res.json(await obtenerConfiguracion())
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Editar
export const editar = async (req, res) => {
  try {
    const { nombreNegocio, intervalo, horario } = req.body
    const config = await obtenerConfiguracion()
    config.set({ nombreNegocio, intervalo, horario })
    res.json(await config.save())
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
