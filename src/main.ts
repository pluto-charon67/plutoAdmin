import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupSrore } from '@/store';

import { useElementPlus } from '@/plugins/elementPlus.ts';
import 'element-plus/dist/index.css';

import { MotionPlugin } from '@vueuse/motion';

// 引入公共样式
import '@/style/reset.scss';
import '@/style/global-theme.scss';

const app = createApp(App);

setupSrore(app); // 注册pinia
app.use(router);
app.use(MotionPlugin);
app.use(useElementPlus);

app.mount('#app');
