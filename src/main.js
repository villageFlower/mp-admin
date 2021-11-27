import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import {api} from './api/index'

const app = createApp(App)


app.config.globalProperties.$api = api;
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')