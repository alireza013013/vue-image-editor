import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/references/index.scss";
import ViewerPlugin from './ViewerPlugin';

const app = createApp(App)
app.use(ViewerPlugin);
app.mount('#app')
