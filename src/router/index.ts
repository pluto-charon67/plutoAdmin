import { createRouter, type Router,  RouteRecordRaw } from 'vue-router';

import fullscreenBaseRoute from "@/router/modules/fullscreenBase"; // 全屏不参与菜单的路由
import { getRouterMode } from './utils.ts';

// 静态路由
const staticRoutes:  RouteRecordRaw[] = [];

const staticRouteModules: Record<string, any> = import.meta.glob(['./modules/**/*.ts', "!./modules/**/fullscreenBase.ts"], { eager: true });
Object.keys(staticRouteModules).forEach(key => {
    staticRoutes.push(staticRouteModules[key].default);
});

const router: Router = createRouter({
    history: getRouterMode(),
    routes: [...staticRoutes, ...fullscreenBaseRoute],
});

export default router;
