import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import TodoDetails from '../pages/TodoDetails.vue'; // Corrected import

const routes = [
  { path: '/', component: Home },
  { path: '/todos/:id', component: TodoDetails }, // Corrected component
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
