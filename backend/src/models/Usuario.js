import { Schema, model } from 'mongoose'

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true, versionKey: false })

export default model('Usuario', usuarioSchema)
