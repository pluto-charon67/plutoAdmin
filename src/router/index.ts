import { createRouter, type Router } from 'vue-router';

import batchImport from '@/utils/batchImport.ts';

// 静态路由
const staticRoutes = [];

const staticRouteModules: Record<string, any> = batchImport();

const router: Router = createRouter({
    history: 'hash',
    routes: [],
});

export default router;
