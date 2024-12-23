import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { useElementPlus } from '@/plugins/elementPlus';

// 引入公共样式
import '@/style/reset.scss';
import '@/style/global-theme.scss';

const app = createApp(App);

app.use(router);
app.use(useElementPlus);

app.mount('#app');
