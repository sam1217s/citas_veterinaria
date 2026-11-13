import { Schema, model } from 'mongoose'

const citaSchema = new Schema({
  mascota: { type: Schema.Types.ObjectId, ref: 'Mascota', required: true },
  servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
  duracion: { type: Number, default: 30 },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  motivo: { type: String, default: '' },
  estado: { type: String, enum: ['pendiente', 'atendida', 'cancelada'], default: 'pendiente' }
}, { timestamps: true, versionKey: false })

export default model('Cita', citaSchema)
