import { createApp } from 'vue'
import App from './App.vue'


import router from './router/index.js';

//importation pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


// Créer une instance de Pinia
const pinia = createPinia()

// Activer la persistance
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(pinia).mount('#app')
