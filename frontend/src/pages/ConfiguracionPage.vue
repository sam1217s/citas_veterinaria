<template>
  <q-page class="q-pa-md q-pa-md-lg">
    <div class="pagina-angosta">
      <div class="q-mb-lg">
        <div class="titulo-pagina">Configuracion</div>
        <div class="text-grey-7">Define los servicios que ofreces y los dias y horarios en que atiende tu negocio.</div>
      </div>

      <q-form v-if="form" @submit="guardar">
        <q-card flat class="tarjeta q-mb-lg">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Datos del negocio</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md q-pt-none">
            <q-input class="col-12 col-sm-7" v-model="form.nombreNegocio" label="Nombre del negocio" outlined :rules="[requerido]">
              <template #prepend><q-icon name="storefront" /></template>
            </q-input>
            <q-select class="col-12 col-sm-5" v-model="form.intervalo" :options="intervalos" emit-value map-options label="Intervalo de la agenda" outlined hint="Cada cuanto se ofrecen horarios para agendar">
              <template #prepend><q-icon name="timer" /></template>
            </q-select>
          </q-card-section>
        </q-card>

        <q-card flat class="tarjeta">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Horario de atencion</div>
            <div class="text-caption text-grey-7">Activa los dias que trabajas y define la hora de apertura y cierre</div>
          </q-card-section>
          <q-separator />

          <q-list separator>
            <q-item v-for="d in diasOrdenados" :key="d.dia" class="q-py-md">
              <q-item-section side style="width: 150px">
                <q-toggle v-model="d.activo" :label="DIAS[d.dia]" color="primary" class="text-weight-medium text-grey-9" />
              </q-item-section>
              <q-item-section>
                <div v-if="d.activo" class="row items-center q-gutter-sm">
                  <q-input v-model="d.inicio" type="time" outlined dense style="width: 140px" hide-bottom-space :error="d.inicio >= d.fin" />
                  <span class="text-grey-7">a</span>
                  <q-input v-model="d.fin" type="time" outlined dense style="width: 140px" hide-bottom-space :error="d.inicio >= d.fin" />
                  <span v-if="d.inicio >= d.fin" class="text-negative text-caption">La apertura debe ser antes del cierre</span>
                </div>
                <div v-else class="text-grey-6"><q-icon name="block" class="q-mr-xs" />Cerrado</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <div class="row justify-end q-mt-lg q-mb-xl">
          <q-btn type="submit" unelevated no-caps color="primary" icon="save" label="Guardar horario" class="boton" :loading="cargando" />
        </div>
      </q-form>

      <div v-else class="flex flex-center q-pa-xl"><q-spinner color="primary" size="40px" /></div>

      <q-card flat class="tarjeta">
        <q-card-section class="row items-center">
          <div class="col">
            <div class="text-subtitle1 text-weight-bold">Servicios</div>
            <div class="text-caption text-grey-7">Cada cita ocupa en la agenda el tiempo del servicio elegido</div>
          </div>
          <q-btn unelevated no-caps color="primary" icon="add" label="Agregar servicio" class="boton" @click="abrirServicio()" />
        </q-card-section>
        <q-separator />

        <q-list separator>
          <q-item v-for="s in servicios" :key="s._id" class="q-py-md">
            <q-item-section avatar>
              <q-avatar :color="s.activo ? 'teal-1' : 'grey-3'" :text-color="s.activo ? 'primary' : 'grey-6'" icon="content_cut" font-size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium" :class="{ 'text-grey-6': !s.activo }">{{ s.nombre }}</q-item-label>
              <q-item-label caption>{{ formatoDuracion(s.duracion) }}{{ s.activo ? '' : ' - Inactivo' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center no-wrap">
                <q-toggle :model-value="s.activo" color="primary" @update:model-value="v => cambiarActivo(s, v)">
                  <q-tooltip>{{ s.activo ? 'Desactivar' : 'Activar' }}</q-tooltip>
                </q-toggle>
                <q-btn flat round dense icon="edit" color="grey-8" @click="abrirServicio(s)"><q-tooltip>Editar</q-tooltip></q-btn>
                <q-btn flat round dense icon="delete_outline" color="negative" @click="borrarServicio(s)"><q-tooltip>Eliminar</q-tooltip></q-btn>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-if="!servicios.length">
            <q-item-section class="text-center text-grey-6 q-py-lg">Aun no tienes servicios. Agrega el primero.</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <q-dialog v-model="dialogoServicio">
      <q-card class="tarjeta" style="width: 420px; max-width: 95vw">
        <q-form @submit="guardarServicio">
          <q-card-section class="text-h6 text-weight-bold">{{ servicio._id ? 'Editar servicio' : 'Agregar servicio' }}</q-card-section>
          <q-card-section class="q-pt-none q-gutter-sm">
            <q-input v-model="servicio.nombre" label="Nombre del servicio" placeholder="Ej: Bano y peluqueria" outlined dense autofocus :rules="[requerido]" />
            <q-select v-model="servicio.duracion" :options="duraciones" emit-value map-options label="Duracion aproximada" outlined dense :rules="[requerido]" />
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat no-caps label="Cancelar" color="grey-8" v-close-popup />
            <q-btn type="submit" unelevated no-caps color="primary" label="Guardar" class="boton" :loading="cargandoServicio" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { guardarConfiguracion } from '../services/configuracion'
import { listarServicios, agregarServicio, editarServicio, eliminarServicio } from '../services/servicios'
import { mensajeError } from '../services/api'
import { configuracion, cargarConfiguracion } from '../stores/configuracion'
import { requerido } from '../helpers/validaciones'
import { DIAS, formatoDuracion } from '../helpers/agenda'

const $q = useQuasar()
const form = ref(null)
const cargando = ref(false)
const servicios = ref([])
const servicio = ref({})
const dialogoServicio = ref(false)
const cargandoServicio = ref(false)

const intervalos = [15, 20, 30, 60].map(m => ({ label: `Cada ${m} minutos`, value: m }))
const duraciones = [15, 20, 30, 45, 60, 75, 90, 120, 150, 180, 240].map(m => ({ label: formatoDuracion(m), value: m }))

// Lunes primero
const diasOrdenados = computed(() => [1, 2, 3, 4, 5, 6, 0].map(dia => form.value.horario.find(h => h.dia === dia)))

const avisar = (message, type = 'positive') => $q.notify({ message, type })

const cargar = async () => {
  try {
    const config = await cargarConfiguracion()
    form.value = JSON.parse(JSON.stringify(config))
    servicios.value = await listarServicios()
  } catch (error) {
    avisar(mensajeError(error), 'negative')
  }
}

// Guardar horario
const guardar = async () => {
  if (form.value.horario.some(h => h.activo && h.inicio >= h.fin)) {
    return avisar('Revisa los horarios: la apertura debe ser antes del cierre', 'warning')
  }
  cargando.value = true
  try {
    const { nombreNegocio, intervalo, horario } = form.value
    configuracion.value = await guardarConfiguracion({ nombreNegocio, intervalo, horario })
    avisar('Configuracion guardada')
  } catch (error) {
    avisar(mensajeError(error), 'negative')
  } finally {
    cargando.value = false
  }
}

// CRUD servicios
const abrirServicio = (s) => {
  servicio.value = s ? { ...s } : { nombre: '', duracion: 30, activo: true }
  dialogoServicio.value = true
}

const guardarServicio = async () => {
  cargandoServicio.value = true
  try {
    const { _id, nombre, duracion, activo } = servicio.value
    if (_id) await editarServicio(_id, { nombre, duracion, activo })
    else await agregarServicio({ nombre, duracion, activo })
    avisar(_id ? 'Servicio actualizado' : 'Servicio agregado')
    dialogoServicio.value = false
    servicios.value = await listarServicios()
  } catch (error) {
    avisar(mensajeError(error), 'negative')
  } finally {
    cargandoServicio.value = false
  }
}

const cambiarActivo = async (s, activo) => {
  try {
    await editarServicio(s._id, { nombre: s.nombre, duracion: s.duracion, activo })
    s.activo = activo
  } catch (error) {
    avisar(mensajeError(error), 'negative')
  }
}

const borrarServicio = (s) => {
  $q.dialog({
    title: 'Eliminar servicio',
    message: `Se eliminara "${s.nombre}".`,
    cancel: { flat: true, noCaps: true, label: 'Cancelar', color: 'grey-8' },
    ok: { unelevated: true, noCaps: true, label: 'Eliminar', color: 'negative' },
    persistent: true
  }).onOk(async () => {
    try {
      await eliminarServicio(s._id)
      avisar('Servicio eliminado')
      servicios.value = await listarServicios()
    } catch (error) {
      avisar(mensajeError(error), 'negative')
    }
  })
}

onMounted(cargar)
</script>
