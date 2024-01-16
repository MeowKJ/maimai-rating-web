// router/index.js

import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";

const routes = [
  {
    path: "/:username",
    name: "App",
    component: App,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
