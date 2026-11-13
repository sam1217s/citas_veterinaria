<template>
  <q-layout>
    <q-page-container>
      <q-page class="row">
        <div class="col-md-6 gt-sm login-lado column justify-center q-pa-xl text-white">
          <div style="max-width: 460px; margin: 0 auto">
            <q-avatar color="white" text-color="primary" icon="pets" size="64px" font-size="34px" style="border-radius: 16px" />
            <div class="text-h3 text-weight-bold q-mt-lg">Agenda veterinaria</div>
            <div class="text-h6 text-weight-regular q-mt-sm" style="opacity: 0.85">
              Organiza las citas de tus pacientes en un solo lugar.
            </div>
            <q-list class="q-mt-xl" style="opacity: 0.95">
              <q-item v-for="b in beneficios" :key="b.icono" class="q-px-none">
                <q-item-section avatar><q-icon :name="b.icono" size="26px" /></q-item-section>
                <q-item-section class="text-body1">{{ b.texto }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center q-pa-lg bg-white">
          <div style="width: 100%; max-width: 400px">
            <q-avatar class="lt-md q-mb-md" color="primary" text-color="white" icon="pets" size="52px" style="border-radius: 14px" />
            <div class="text-h5 text-weight-bold">{{ esRegistro ? 'Crea tu cuenta' : 'Bienvenido de nuevo' }}</div>
            <div class="text-grey-7 q-mb-lg">{{ esRegistro ? 'Registrate para empezar a agendar citas' : 'Ingresa para ver tu agenda' }}</div>

            <q-form @submit="enviar" class="q-gutter-y-sm">
              <template v-if="esRegistro">
                <q-input v-model="form.nombre" label="Nombre" outlined :rules="[requerido]">
                  <template #prepend><q-icon name="person_outline" /></template>
                </q-input>
                <q-input v-model="form.correo" label="Correo" outlined :rules="[correoValido]">
                  <template #prepend><q-icon name="mail_outline" /></template>
                </q-input>
                <q-input v-model="form.telefono" label="Telefono" outlined :rules="[telefonoValido]">
                  <template #prepend><q-icon name="phone" /></template>
                </q-input>
              </template>
              <q-input v-else v-model="form.acceso" label="Correo o telefono" outlined :rules="[requerido]">
                <template #prepend><q-icon name="person_outline" /></template>
              </q-input>

              <q-input v-model="form.password" :type="verPassword ? 'text' : 'password'" label="Contrasena" outlined :rules="[passwordValido]">
                <template #prepend><q-icon name="lock_outline" /></template>
                <template #append>
                  <q-icon :name="verPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="verPassword = !verPassword" />
                </template>
              </q-input>

              <q-btn type="submit" unelevated no-caps color="primary" size="lg" class="full-width boton q-mt-md" :label="esRegistro ? 'Crear cuenta' : 'Ingresar'" :loading="cargando" />
            </q-form>

            <div class="text-center q-mt-lg text-grey-7">
              {{ esRegistro ? 'Ya tienes cuenta?' : 'No tienes cuenta?' }}
              <a href="#" class="text-primary text-weight-bold" style="text-decoration: none" @click.prevent="esRegistro = !esRegistro">
                {{ esRegistro ? 'Inicia sesion' : 'Registrate' }}
              </a>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { login, registro } from '../services/auth'
import { mensajeError } from '../services/api'
import { guardarSesion } from '../helpers/sesion'
import { requerido, correoValido, telefonoValido, passwordValido } from '../helpers/validaciones'

const $q = useQuasar()
const router = useRouter()
const esRegistro = ref(false)
const cargando = ref(false)
const verPassword = ref(false)
const form = ref({ nombre: '', correo: '', telefono: '', acceso: '', password: '' })

const beneficios = [
  { icono: 'calendar_month', texto: 'Calendario por dia, semana y mes' },
  { icono: 'schedule', texto: 'Horarios de atencion configurables' },
  { icono: 'pets', texto: 'Registro rapido de mascotas al agendar' }
]

// Login y registro
const enviar = async () => {
  cargando.value = true
  try {
    const { nombre, correo, telefono, acceso, password } = form.value
    const data = esRegistro.value
      ? await registro({ nombre, correo, telefono, password })
      : await login({ acceso, password })
    guardarSesion(data)
    router.push('/')
  } catch (error) {
    $q.notify({ message: mensajeError(error), type: 'negative' })
  } finally {
    cargando.value = false
  }
}
</script>
