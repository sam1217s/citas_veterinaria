import { date } from 'quasar'
import es from 'quasar/lang/es'

export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

export const ESTADOS = {
  pendiente: { label: 'Pendiente', fondo: '#fef3c7', borde: '#f59e0b', texto: '#78350f' },
  atendida: { label: 'Atendida', fondo: '#dcfce7', borde: '#16a34a', texto: '#14532d' },
  cancelada: { label: 'Cancelada', fondo: '#f1f5f9', borde: '#94a3b8', texto: '#64748b' }
}

export const aMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export const aHora = (minutos) => `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`

export const hoy = () => date.formatDate(Date.now(), 'YYYY-MM-DD')

export const ahoraMinutos = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

export const formatoFecha = (fecha, formato) => date.formatDate(date.extractDate(fecha, 'YYYY-MM-DD'), formato, es.date)

export const formatoHora = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`
}

export const formatoDuracion = (minutos) => {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

export const etiquetaDia = (fecha) => {
  const manana = date.formatDate(date.addToDate(Date.now(), { days: 1 }), 'YYYY-MM-DD')
  if (fecha === hoy()) return 'Hoy'
  if (fecha === manana) return 'Manana'
  return formatoFecha(fecha, 'dddd D [de] MMMM')
}

export const horarioDelDia = (config, fecha) => config?.horario.find(h => h.dia === new Date(`${fecha}T00:00:00`).getDay())

// Horas donde cabe el servicio dentro del horario del negocio
export const generarHoras = (config, fecha, duracion) => {
  const horario = horarioDelDia(config, fecha)
  if (!horario?.activo) return []
  const horas = []
  for (let m = aMinutos(horario.inicio); m + duracion <= aMinutos(horario.fin); m += config.intervalo) {
    horas.push(aHora(m))
  }
  return horas
}
