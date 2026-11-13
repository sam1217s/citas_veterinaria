<template>
  <q-page class="q-pa-md q-pa-md-lg">
    <div class="row items-center q-mb-lg q-col-gutter-sm">
      <div class="col">
        <div class="titulo-pagina">Calendario</div>
        <div class="text-grey-7">{{ resumenHoy }}</div>
      </div>
      <div class="col-auto">
        <q-btn unelevated no-caps color="primary" icon="add" label="Agendar cita" class="boton" @click="abrir()" />
      </div>
    </div>

    <q-card flat class="tarjeta q-pa-md">
      <FullCalendar ref="calendario" :options="opciones" />
    </q-card>

    <CitaDialog
      v-model="dialogo"
      :cita="citaEditar"
      :fecha-inicial="fechaInicial"
      :hora-inicial="horaInicial"
      :citas="citas"
      @guardado="cargar"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import CitaDialog from '../components/CitaDialog.vue'
import { listarCitas } from '../services/citas'
import { mensajeError } from '../services/api'
import { configuracion } from '../stores/configuracion'
import { ESTADOS, aMinutos, aHora, hoy } from '../helpers/agenda'

const $q = useQuasar()
const calendario = ref(null)
const citas = ref([])
const dialogo = ref(false)
const citaEditar = ref(null)
const fechaInicial = ref('')
const horaInicial = ref('')

const intervalo = computed(() => configuracion.value?.intervalo || 30)

const resumenHoy = computed(() => {
  const n = citas.value.filter(c => c.fecha === hoy() && c.estado === 'pendiente').length
  return n ? `Hoy tienes ${n} ${n === 1 ? 'cita pendiente' : 'citas pendientes'}` : 'Hoy no tienes citas pendientes'
})

const eventos = computed(() => citas.value.map(c => {
  const e = ESTADOS[c.estado]
  return {
    id: c._id,
    title: `${c.mascota?.nombre || 'Mascota'} - ${c.servicio?.nombre || 'Sin servicio'}`,
    start: `${c.fecha}T${c.hora}`,
    end: `${c.fecha}T${aHora(aMinutos(c.hora) + (c.duracion || 30))}`,
    backgroundColor: e.fondo,
    borderColor: e.borde,
    textColor: e.texto,
    classNames: c.estado === 'cancelada' ? ['evento-cancelado'] : [],
    extendedProps: { cita: c }
  }
}))

const opciones = computed(() => {
  const activos = configuracion.value?.horario.filter(h => h.activo) || []
  const minimo = activos.length ? Math.min(...activos.map(h => aMinutos(h.inicio))) : 7 * 60
  const maximo = activos.length ? Math.max(...activos.map(h => aMinutos(h.fin))) : 19 * 60

  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: $q.screen.lt.md ? 'timeGridDay' : 'timeGridWeek',
    headerToolbar: { left: 'today prev,next title', center: '', right: 'timeGridDay,timeGridWeek,dayGridMonth' },
    height: 'auto',
    allDaySlot: false,
    nowIndicator: true,
    navLinks: true,
    dayMaxEvents: 3,
    slotDuration: `${aHora(intervalo.value)}:00`,
    slotMinTime: `${aHora(minimo)}:00`,
    slotMaxTime: `${aHora(maximo)}:00`,
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
    eventTimeFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
    businessHours: activos.map(h => ({ daysOfWeek: [h.dia], startTime: h.inicio, endTime: h.fin })),
    events: eventos.value,
    dateClick: alHacerClic,
    eventClick: (info) => abrir(info.event.extendedProps.cita)
  }
})

// Listar
const cargar = async () => {
  try {
    citas.value = await listarCitas()
  } catch (error) {
    $q.notify({ message: mensajeError(error), type: 'negative' })
  }
}

const abrir = (cita = null, fecha = '', hora = '') => {
  citaEditar.value = cita
  fechaInicial.value = fecha
  horaInicial.value = hora
  dialogo.value = true
}

// Clic en el mes abre el dia, clic en una hora agenda
const alHacerClic = (info) => {
  if (info.view.type === 'dayGridMonth') return calendario.value.getApi().changeView('timeGridDay', info.dateStr)
  const [fecha, hora] = info.dateStr.split('T')
  abrir(null, fecha, hora.slice(0, 5))
}

onMounted(cargar)
</script>
