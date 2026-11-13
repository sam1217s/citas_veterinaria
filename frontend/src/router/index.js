import { createRouter, createWebHashHistory } from 'vue-router'
import { obtenerToken } from '../helpers/sesion'
import MainLayout from '../layouts/MainLayout.vue'
import LoginPage from '../pages/LoginPage.vue'
import CalendarioPage from '../pages/CalendarioPage.vue'
import CitasPage from '../pages/CitasPage.vue'
import ConfiguracionPage from '../pages/ConfiguracionPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', component: LoginPage },
    {
      path: '/',
      component: MainLayout,
      redirect: '/calendario',
      children: [
        { path: 'calendario', component: CalendarioPage },
        { path: 'citas', component: CitasPage },
        { path: 'configuracion', component: ConfiguracionPage }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// Proteger rutas
router.beforeEach((to) => {
  if (to.path !== '/login' && !obtenerToken()) return '/login'
  if (to.path === '/login' && obtenerToken()) return '/'
})

export default router
