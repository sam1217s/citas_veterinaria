import { Schema, model } from 'mongoose'

const servicioSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  duracion: { type: Number, required: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })

export default model('Servicio', servicioSchema)
