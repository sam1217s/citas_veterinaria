import { Schema, model } from 'mongoose'

const mascotaSchema = new Schema({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  raza: { type: String, default: '' },
  edad: { type: Number, default: 0 },
  dueno: { type: String, required: true },
  telefono: { type: String, required: true }
}, { timestamps: true, versionKey: false })

export default model('Mascota', mascotaSchema)
