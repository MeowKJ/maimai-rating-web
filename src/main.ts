import { createApp } from "vue";
import { createPinia } from "pinia";

import router from "./router"; // 导入创建的路由实例

import "@/asstes/styles/style.css";
import App from "./App.vue";

import { inject } from "@vercel/analytics";

inject(); // Vercel 分析

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount("#app");
