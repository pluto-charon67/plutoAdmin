const Layout = () => import('@/layout/index.vue');

export default {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/welcome',
    meta: {
        title: '首页',
    },
    children: [
        {
            path: '/welcome',
            name: 'Welcome',
            component: () => import('@/views/welcome/index.vue'),
            meta: {
                title: '首页',
            },
        },
    ],
};
