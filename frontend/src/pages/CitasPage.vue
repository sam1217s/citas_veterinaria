<template>
  <q-page class="q-pa-md q-pa-md-lg">
    <div class="row items-center q-mb-lg q-col-gutter-sm">
      <div class="col">
        <div class="titulo-pagina">Citas</div>
        <div class="text-grey-7">Consulta, edita o cancela las citas agendadas</div>
      </div>
      <div class="col-auto">
        <q-btn unelevated no-caps color="primary" icon="add" label="Agendar cita" class="boton" @click="abrir()" />
      </div>
    </div>

    <q-card flat class="tarjeta">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-5">
          <q-input v-model="buscar" outlined dense clearable placeholder="Buscar por mascota, dueno o servicio">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-12 col-md-7 row justify-md-end">
          <q-btn-toggle
            v-model="filtro"
            no-caps unelevated rounded
            color="grey-2" text-color="grey-8" toggle-color="primary"
            :options="filtros"
          />
        </div>
      </q-card-section>

      <q-table
        flat
        :rows="filtradas"
        :columns="columnas"
        row-key="_id"
        :pagination="{ rowsPerPage: 10, sortBy: 'fecha' }"
        no-data-label="No hay citas para mostrar"
        rows-per-page-label="Filas por pagina"
      >
        <template #body-cell-fecha="props">
          <q-td :props="props">
            <div class="text-weight-medium first-letter">{{ etiquetaDia(props.row.fecha) }}</div>
            <div class="text-caption text-grey-7">{{ formatoHora(props.row.hora) }}</div>
          </q-td>
        </template>
        <template #body-cell-mascota="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.mascota?.nombre }}</div>
            <div class="text-caption text-grey-7">{{ props.row.mascota?.especie }}</div>
          </q-td>
        </template>
        <template #body-cell-dueno="props">
          <q-td :props="props">
            <div>{{ props.row.mascota?.dueno }}</div>
            <div class="text-caption text-grey-7">{{ props.row.mascota?.telefono }}</div>
          </q-td>
        </template>
        <template #body-cell-servicio="props">
          <q-td :props="props">
            <div>{{ props.row.servicio?.nombre || 'Sin servicio' }}</div>
            <div class="text-caption text-grey-7">{{ formatoDuracion(props.row.duracion || 30) }}<span v-if="props.row.motivo"> - {{ props.row.motivo }}</span></div>
          </q-td>
        </template>
        <template #body-cell-estado="props">
          <q-td :props="props">
            <span class="estado" :style="estiloEstado(props.row.estado)">{{ ESTADOS[props.row.estado].label }}</span>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="grey-8" @click="abrir(props.row)"><q-tooltip>Editar</q-tooltip></q-btn>
            <q-btn flat round dense icon="delete_outline" color="negative" @click="eliminar(props.row)"><q-tooltip>Eliminar</q-tooltip></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <CitaDialog v-model="dialogo" :cita="citaEditar" :citas="citas" @guardado="cargar" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import CitaDialog from '../components/CitaDialog.vue'
import { listarCitas, eliminarCita } from '../services/citas'
import { mensajeError } from '../services/api'
import { ESTADOS, formatoHora, formatoDuracion, etiquetaDia } from '../helpers/agenda'

const $q = useQuasar()
const citas = ref([])
const buscar = ref('')
const filtro = ref('todas')
const dialogo = ref(false)
const citaEditar = ref(null)

const filtros = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Atendidas', value: 'atendida' },
  { label: 'Canceladas', value: 'cancelada' }
]

const columnas = [
  { name: 'fecha', label: 'Fecha', field: r => `${r.fecha} ${r.hora}`, align: 'left', sortable: true },
  { name: 'mascota', label: 'Mascota', field: r => r.mascota?.nombre, align: 'left', sortable: true },
  { name: 'dueno', label: 'Dueno', field: r => r.mascota?.dueno, align: 'left' },
  { name: 'servicio', label: 'Servicio', field: r => r.servicio?.nombre, align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
  { name: 'acciones', label: '', field: 'acciones', align: 'right' }
]

const filtradas = computed(() => {
  const t = (buscar.value || '').toLowerCase()
  return citas.value.filter(c =>
    (filtro.value === 'todas' || c.estado === filtro.value) &&
    [c.mascota?.nombre, c.mascota?.dueno, c.servicio?.nombre, c.motivo].some(v => v?.toLowerCase().includes(t))
  )
})

const estiloEstado = (estado) => ({ background: ESTADOS[estado].fondo, color: ESTADOS[estado].texto })

// Listar
const cargar = async () => {
  try {
    citas.value = await listarCitas()
  } catch (error) {
    $q.notify({ message: mensajeError(error), type: 'negative' })
  }
}

const abrir = (cita = null) => {
  citaEditar.value = cita
  dialogo.value = true
}

// Eliminar
const eliminar = (cita) => {
  $q.dialog({
    title: 'Eliminar cita',
    message: `Se eliminara la cita de ${cita.mascota?.nombre}. Esta accion no se puede deshacer.`,
    cancel: { flat: true, noCaps: true, label: 'Cancelar', color: 'grey-8' },
    ok: { unelevated: true, noCaps: true, label: 'Eliminar', color: 'negative' },
    persistent: true
  }).onOk(async () => {
    try {
      await eliminarCita(cita._id)
      $q.notify({ message: 'Cita eliminada', type: 'positive' })
      cargar()
    } catch (error) {
      $q.notify({ message: mensajeError(error), type: 'negative' })
    }
  })
}

onMounted(cargar)
</script>

<style scoped>
.estado {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.first-letter::first-letter {
  text-transform: uppercase;
}
</style>
