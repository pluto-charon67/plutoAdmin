import { type RouterHistory, createWebHashHistory, createWebHistory } from 'vue-router';

// 根据环境配置，获取路由模式(hash、history)
function getRouterMode(): RouterHistory {
    const mode = import.meta.env.VITE_ROUTER_MODE;
    if (mode === 'h5') return createWebHistory('');
    return createWebHashHistory('');
}

export { getRouterMode };
