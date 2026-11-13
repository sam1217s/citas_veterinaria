import { ref } from 'vue'
import { obtenerConfiguracion } from '../services/configuracion'

// Configuracion compartida entre paginas
export const configuracion = ref(null)

export const cargarConfiguracion = async () => {
  configuracion.value = await obtenerConfiguracion()
  return configuracion.value
}
