import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes'; // your Vue Router setup
import {
  VueQueryPlugin,
  QueryClient,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query';

const app = createApp(App);
app.use(router);

const queryClient = new QueryClient();
const vueQueryOptions: VueQueryPluginOptions = { queryClient };
app.use(VueQueryPlugin, vueQueryOptions);

app.mount('#app');
