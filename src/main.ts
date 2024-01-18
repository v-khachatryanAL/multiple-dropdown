
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import { installClickOutsideDirective } from './directives/ClickOutsideDirective';

const app = createApp(App)
installClickOutsideDirective(app);
app.use(createPinia())
app.use(router)

app.mount('#app')
