// router/index.js

import {createRouter, createWebHistory} from 'vue-router';
import App from '../App.vue';

const routes = [
    {
        path: '/:username', // 动态路由参数 :username
        name: 'App',
        component: App,
    },
    // 其他路由规则
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
