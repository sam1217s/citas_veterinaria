<template>
  <q-dialog :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)" @before-show="iniciar">
    <q-card class="tarjeta" style="width: 560px; max-width: 95vw">
      <q-card-section class="row items-center no-wrap">
        <q-avatar :icon="form._id ? 'edit_calendar' : 'event_available'" color="teal-1" text-color="primary" font-size="22px" />
        <div class="q-ml-md">
          <div class="text-h6 text-weight-bold">{{ form._id ? 'Editar cita' : 'Agendar cita' }}</div>
          <div class="text-caption text-grey-7 first-letter">{{ subtitulo }}</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-form @submit="guardar">
        <q-card-section>
          <div class="seccion-titulo"><q-icon name="pets" size="16px" /> Paciente</div>

          <q-btn-toggle
            v-if="!form._id"
            v-model="tipoMascota"
            spread no-caps unelevated
            class="q-mb-md"
            color="grey-2" text-color="grey-8" toggle-color="primary"
            :options="[{ label: 'Mascota nueva', value: 'nueva', icon: 'add' }, { label: 'Ya registrada', value: 'existente', icon: 'search' }]"
          />

          <div v-if="tipoMascota === 'nueva' && !form._id" class="row q-col-gutter-sm">
            <q-input class="col-12 col-sm-6" v-model="mascota.nombre" label="Nombre del animal" outlined dense :rules="[requerido]" />
            <q-select class="col-12 col-sm-6" v-model="mascota.especie" :options="especies" label="Especie" outlined dense :rules="[requerido]" />
            <q-input class="col-12 col-sm-8" v-model="mascota.raza" label="Raza" outlined dense />
            <q-input class="col-12 col-sm-4" v-model.number="mascota.edad" type="number" label="Edad (anos)" outlined dense :rules="[edadValida]" />
            <q-input class="col-12 col-sm-6" v-model="mascota.dueno" label="Nombre del dueno" outlined dense :rules="[requerido]" />
            <q-input class="col-12 col-sm-6" v-model="mascota.telefono" label="Telefono" outlined dense :rules="[telefonoValido]" />
          </div>

          <q-select
            v-else
            v-model="form.mascota"
            :options="opcFiltradas"
            emit-value map-options use-input input-debounce="0"
            label="Buscar por mascota o dueno" outlined dense
            :rules="[requerido]"
            @filter="filtrar"
          >
            <template #prepend><q-icon name="search" /></template>
            <template #no-option><q-item><q-item-section class="text-grey">Sin resultados</q-item-section></q-item></template>
          </q-select>

          <div class="seccion-titulo q-mt-sm"><q-icon name="schedule" size="16px" /> Cita</div>

          <div class="row q-col-gutter-sm">
            <q-select class="col-12" v-model="form.servicio" :options="opcServicios" emit-value map-options label="Servicio" outlined dense :rules="[requerido]">
              <template #prepend><q-icon name="content_cut" /></template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                  <q-item-section side><q-badge color="teal-1" text-color="primary" :label="formatoDuracion(scope.opt.duracion)" /></q-item-section>
                </q-item>
              </template>
              <template #no-option>
                <q-item><q-item-section class="text-grey">No hay servicios activos. Agregalos en Configuracion.</q-item-section></q-item>
              </template>
            </q-select>

            <q-input class="col-12 col-sm-6" :model-value="fechaTexto" label="Fecha" outlined dense readonly :rules="[() => !!form.fecha || 'Campo obligatorio']" @click="popupFecha.show()">
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="popupFecha" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fecha" mask="YYYY-MM-DD" :options="fechaPermitida" color="primary" @update:model-value="popupFecha.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              class="col-12 col-sm-6"
              v-model="form.hora"
              :options="horas"
              emit-value map-options
              label="Hora" outlined dense
              :hint="horaFin ? `Termina aprox. a las ${horaFin}` : ''"
              :rules="[requerido]"
            >
              <template #prepend><q-icon name="schedule" /></template>
              <template #no-option>
                <q-item><q-item-section class="text-grey">{{ servicio ? 'No hay horarios disponibles este dia' : 'Primero elige un servicio' }}</q-item-section></q-item>
              </template>
            </q-select>

            <q-input class="col-12" v-model="form.motivo" label="Notas (opcional)" outlined dense autogrow />
          </div>

          <template v-if="form._id">
            <div class="seccion-titulo q-mt-md"><q-icon name="flag" size="16px" /> Estado</div>
            <q-btn-toggle
              v-model="form.estado"
              spread no-caps unelevated
              color="grey-2" text-color="grey-8" toggle-color="primary"
              :options="opcEstados"
            />
          </template>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancelar" color="grey-8" v-close-popup />
          <q-btn type="submit" unelevated no-caps color="primary" class="boton" :label="form._id ? 'Guardar cambios' : 'Agendar'" :loading="cargando" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { agregarCita, editarCita } from '../services/citas'
import { listarMascotas, agregarMascota } from '../services/mascotas'
import { listarServicios } from '../services/servicios'
import { mensajeError } from '../services/api'
import { configuracion } from '../stores/configuracion'
import { requerido, edadValida, telefonoValido } from '../helpers/validaciones'
import { ESTADOS, aMinutos, aHora, hoy, ahoraMinutos, formatoFecha, formatoHora, formatoDuracion, horarioDelDia, generarHoras } from '../helpers/agenda'

const props = defineProps({
  modelValue: Boolean,
  cita: { type: Object, default: null },
  fechaInicial: { type: String, default: '' },
  horaInicial: { type: String, default: '' },
  citas: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'guardado'])

const $q = useQuasar()
const form = ref({})
const mascota = ref({})
const mascotas = ref([])
const servicios = ref([])
const opcFiltradas = ref([])
const tipoMascota = ref('nueva')
const cargando = ref(false)
const popupFecha = ref(null)

const especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hamster', 'Otro']
const opcEstados = Object.entries(ESTADOS).map(([value, e]) => ({ value, label: e.label }))

const servicio = computed(() => servicios.value.find(s => s._id === form.value.servicio))
const fechaTexto = computed(() => form.value.fecha ? formatoFecha(form.value.fecha, 'dddd D [de] MMMM YYYY') : '')
const horaFin = computed(() => servicio.value && form.value.hora ? formatoHora(aHora(aMinutos(form.value.hora) + servicio.value.duracion)) : '')
const subtitulo = computed(() => form.value.fecha && form.value.hora ? `${fechaTexto.value} - ${formatoHora(form.value.hora)}` : 'Completa los datos de la cita')
const opcMascotas = computed(() => mascotas.value.map(m => ({ label: `${m.nombre} (${m.especie}) - ${m.dueno}`, value: m._id })))

// Servicios activos y el de la cita aunque este inactivo
const opcServicios = computed(() => servicios.value
  .filter(s => s.activo || s._id === props.cita?.servicio?._id)
  .map(s => ({ label: s.nombre, value: s._id, duracion: s.duracion })))

// Solo dias laborales desde hoy
const fechaPermitida = (d) => {
  const fecha = d.replaceAll('/', '-')
  return fecha >= hoy() && !!horarioDelDia(configuracion.value, fecha)?.activo
}

// Horas donde cabe el servicio, marcando las que se cruzan
const horas = computed(() => {
  const config = configuracion.value
  if (!config || !form.value.fecha || !servicio.value) return []
  const duracion = servicio.value.duracion
  const otras = props.citas.filter(c => c.fecha === form.value.fecha && c.estado !== 'cancelada' && c._id !== form.value._id)
  const esHoy = form.value.fecha === hoy()

  const lista = generarHoras(config, form.value.fecha, duracion)
    .filter(h => !esHoy || aMinutos(h) > ahoraMinutos())
    .map(h => {
      const inicio = aMinutos(h)
      const ocupada = otras.some(c => inicio < aMinutos(c.hora) + (c.duracion || 30) && aMinutos(c.hora) < inicio + duracion)
      return { value: h, label: formatoHora(h) + (ocupada ? ' (ocupada)' : ''), disable: ocupada }
    })

  const c = props.cita
  if (c && form.value.fecha === c.fecha && form.value.servicio === c.servicio?._id && !lista.some(o => o.value === c.hora)) {
    lista.unshift({ value: c.hora, label: formatoHora(c.hora) })
  }
  return lista
})

watch(horas, (lista) => {
  if (form.value.hora && !lista.some(o => o.value === form.value.hora && !o.disable)) form.value.hora = null
})

const filtrar = (texto, update) => {
  update(() => {
    const t = texto.toLowerCase()
    opcFiltradas.value = opcMascotas.value.filter(o => o.label.toLowerCase().includes(t))
  })
}

const iniciar = async () => {
  const c = props.cita
  mascota.value = { nombre: '', especie: '', raza: '', edad: 0, dueno: '', telefono: '' }
  tipoMascota.value = 'nueva'
  form.value = c
    ? { _id: c._id, mascota: c.mascota?._id, servicio: c.servicio?._id || null, fecha: c.fecha, hora: c.hora, motivo: c.motivo, estado: c.estado }
    : { mascota: null, servicio: null, fecha: props.fechaInicial || hoy(), hora: props.horaInicial || null, motivo: '' }
  try {
    const [listaMascotas, listaServicios] = await Promise.all([listarMascotas(), listarServicios()])
    mascotas.value = listaMascotas
    servicios.value = listaServicios
  } catch (error) {
    $q.notify({ message: mensajeError(error), type: 'negative' })
  }
}

// Agregar y editar
const guardar = async () => {
  cargando.value = true
  try {
    if (!form.value._id && tipoMascota.value === 'nueva') {
      const nueva = await agregarMascota(mascota.value)
      mascotas.value.unshift(nueva)
      form.value.mascota = nueva._id
      tipoMascota.value = 'existente'
    }
    const { _id, ...datos } = form.value
    if (_id) await editarCita(_id, datos)
    else await agregarCita(datos)
    $q.notify({ message: _id ? 'Cita actualizada' : 'Cita agendada', type: 'positive', icon: 'check_circle' })
    emit('guardado', datos.fecha)
    emit('update:modelValue', false)
  } catch (error) {
    $q.notify({ message: mensajeError(error), type: 'negative' })
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.first-letter::first-letter {
  text-transform: uppercase;
}
</style>
