import {createApp} from 'vue'
import router from './router'; // 导入创建的路由实例

import './style.css'
import App from './App.vue'


createApp(App).use(router).mount('#app');
