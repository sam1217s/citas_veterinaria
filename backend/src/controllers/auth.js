import bcrypt from 'bcryptjs'
import Usuario from '../models/Usuario.js'
import { generarJWT } from '../helpers/generarJWT.js'

const datosUsuario = ({ nombre, correo, telefono }) => ({ nombre, correo, telefono })

// Registro
export const registro = async (req, res) => {
  try {
    const { nombre, correo, telefono, password } = req.body
    const usuario = await Usuario.create({ nombre, correo, telefono, password: bcrypt.hashSync(password, 10) })
    res.status(201).json({ usuario: datosUsuario(usuario), token: generarJWT(usuario._id) })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Login con correo o telefono
export const login = async (req, res) => {
  try {
    const { acceso, password } = req.body
    const usuario = await Usuario.findOne({ $or: [{ correo: acceso }, { telefono: acceso }] })
    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
      return res.status(400).json({ msg: 'Datos de acceso incorrectos' })
    }
    res.json({ usuario: datosUsuario(usuario), token: generarJWT(usuario._id) })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
