// main.js
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueColumnsResizable from 'vue-columns-resizable'
import resizableDirective from './resizableDirective'

const app = createApp(App)
app.use(VueColumnsResizable)
app.directive('resizable', resizableDirective)

app.mount('#app')
