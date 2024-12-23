import { createRouter, type Router } from 'vue-router';

import { getRouterMode } from './utils.ts';

// 静态路由
const staticRoutes = [];

const staticRouteModules: Record<string, any> = import.meta.glob(['./modules/**/*.ts'], { eager: true });
Object.keys(staticRouteModules).forEach(key => {
    staticRoutes.push(staticRouteModules[key].default);
});

const router: Router = createRouter({
    history: getRouterMode(),
    routes: staticRoutes,
});

export default router;
