import { createRouter, type Router, RouteRecordRaw } from 'vue-router';

import fullscreenBaseRoute from '@/router/modules/fullscreenBase.ts'; // 全屏不参与菜单的路由
import Nprogress from '@/utils/nprogress.ts';
import { getRouterMode } from './utils.ts';
import nprogress from '@/utils/nprogress.ts';

// 静态路由
const staticRoutes: RouteRecordRaw[] = [];

const staticRouteModules: Record<string, any> = import.meta.glob(['./modules/**/*.ts', '!./modules/**/fullscreenBase.ts'], {
    eager: true,
});
Object.keys(staticRouteModules).forEach(key => {
    staticRoutes.push(staticRouteModules[key].default);
});

const router: Router = createRouter({
    history: getRouterMode(),
    routes: [...staticRoutes, ...fullscreenBaseRoute],
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
    Nprogress.start();
    next();
});

// 全局后置路由守卫
router.afterEach(() => {
    Nprogress.done();
});

// 路由跳转错误
router.onError((error: any) => {
    Nprogress.done();
    console.warn('路由错误', error.message);
});

export default router;
