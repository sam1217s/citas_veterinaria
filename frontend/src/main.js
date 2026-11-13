import { createApp } from 'vue'
import { Quasar, Notify, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/es'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './css/app.css'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(Quasar, {
    plugins: { Notify, Dialog },
    lang: quasarLang,
    config: {
      brand: { primary: '#0d9488', secondary: '#115e59', accent: '#6366f1', positive: '#16a34a', negative: '#dc2626', warning: '#f59e0b' },
      notify: { position: 'top-right', timeout: 2500 }
    }
  })
  .use(router)
  .mount('#app')
