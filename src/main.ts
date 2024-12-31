import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { useElementPlus } from '@/plugins/elementPlus.ts';

import { MotionPlugin } from '@vueuse/motion';

// 引入公共样式
import '@/style/reset.scss';
import '@/style/global-theme.scss';

const app = createApp(App);

app.use(router);
app.use(MotionPlugin);
app.use(useElementPlus);

app.mount('#app');
