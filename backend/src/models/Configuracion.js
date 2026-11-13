import { Schema, model } from 'mongoose'

const diaSchema = new Schema({
  dia: { type: Number, required: true },
  activo: { type: Boolean, default: false },
  inicio: { type: String, default: '08:00' },
  fin: { type: String, default: '18:00' }
}, { _id: false })

// Lunes a viernes 8-18, sabado 8-12, domingo cerrado
const horarioInicial = () => [0, 1, 2, 3, 4, 5, 6].map(dia => ({
  dia,
  activo: dia !== 0,
  inicio: '08:00',
  fin: dia === 6 ? '12:00' : '18:00'
}))

const configuracionSchema = new Schema({
  nombreNegocio: { type: String, default: 'Mi Veterinaria' },
  intervalo: { type: Number, default: 30 },
  horario: { type: [diaSchema], default: horarioInicial },
  serviciosIniciales: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export default model('Configuracion', configuracionSchema, 'configuracion')
