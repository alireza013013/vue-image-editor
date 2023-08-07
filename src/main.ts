import { createApp } from 'vue'
import App from './App.vue'
import ViewerPlugin from './ViewerPlugin';
import "@/assets/references/index.scss";

const app = createApp(App)
app.use(ViewerPlugin);
app.mount('#app')
