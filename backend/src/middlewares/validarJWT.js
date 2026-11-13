import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

export const validarJWT = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ msg: 'No hay token en la peticion' })

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findById(id)
    if (!usuario) return res.status(401).json({ msg: 'Token no valido' })
    req.usuario = usuario
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token no valido' })
  }
}
