import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Router.js'

createApp(App)
    .use(router)
    .mount('#app')
