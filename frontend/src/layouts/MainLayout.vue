<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="encabezado">
      <q-toolbar class="q-px-md q-px-md-lg" style="min-height: 64px">
        <q-avatar color="primary" text-color="white" icon="pets" size="40px" font-size="22px" rounded style="border-radius: 10px" />
        <div class="q-ml-sm q-mr-lg">
          <div class="text-weight-bold ellipsis" style="max-width: 200px">{{ configuracion?.nombreNegocio || 'Mi Veterinaria' }}</div>
          <div class="text-caption text-grey-7" style="margin-top: -2px">Agenda de citas</div>
        </div>

        <q-tabs no-caps inline-label dense active-color="primary" indicator-color="primary" class="text-grey-8 gt-xs">
          <q-route-tab to="/calendario" icon="calendar_month" label="Calendario" />
          <q-route-tab to="/citas" icon="event_note" label="Citas" />
        </q-tabs>

        <q-space />

        <q-btn flat round>
          <q-avatar color="teal-1" text-color="primary" size="38px" font-size="15px" class="text-weight-bold">{{ iniciales }}</q-avatar>
          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
            <q-list style="min-width: 240px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" font-size="15px" class="text-weight-bold">{{ iniciales }}</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ usuario?.nombre }}</q-item-label>
                  <q-item-label caption>{{ usuario?.correo }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/configuracion">
                <q-item-section avatar><q-icon name="settings" color="grey-7" /></q-item-section>
                <q-item-section>Configuracion</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="salir">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section class="text-negative">Cerrar sesion</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-tabs no-caps dense active-color="primary" indicator-color="primary" class="text-grey-8 xs" align="justify">
        <q-route-tab to="/calendario" icon="calendar_month" label="Calendario" />
        <q-route-tab to="/citas" icon="event_note" label="Citas" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerUsuario, cerrarSesion } from '../helpers/sesion'
import { configuracion, cargarConfiguracion } from '../stores/configuracion'

const router = useRouter()
const usuario = obtenerUsuario()
const iniciales = computed(() => (usuario?.nombre || '?').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase())

// Cerrar sesion
const salir = () => {
  cerrarSesion()
  router.push('/login')
}

onMounted(() => cargarConfiguracion().catch(() => {}))
</script>
