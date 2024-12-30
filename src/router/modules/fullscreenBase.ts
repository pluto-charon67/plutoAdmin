// 不参与菜单的全屏基础路由，即没有侧边栏和页签内容
export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/login/index.vue"),
        meta: {
            title: '登录页',
        },
    },
]