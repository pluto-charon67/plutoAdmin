import { defineFakeRoute } from 'vite-plugin-fake-server/client';

const permissionRouter = [
    {
        path: '/permission',
        meta: {
            title: '权限管理',
            icon: 'ep:lollipop',
            sort: 10,
        },
        children: [
            {
                path: '/permission/page/index',
                name: 'PermissionPage',
                meta: {
                    title: '页面权限',
                    roles: ['admin', 'common'],
                },
            },
            {
                path: '/permission/button',
                meta: {
                    title: '',
                    roles: ['admin', 'common'],
                },
                children: [
                    {
                        path: 'permission/button/router',
                        name: 'PermissionButtonRouter',
                        component: 'permission/button/index',
                        meta: {
                            title: '路由返回按钮权限',
                            auths: ['permission:btn:add', 'permission:btn:edit', 'permission:btn:delete'],
                        },
                    },
                    {
                        path: '/permission/button/login',
                        component: 'permission/button/perms',
                        name: 'PermissionButtonLogin',
                        meta: {
                            title: '登录接口返回按钮权限',
                        },
                    },
                ],
            },
        ],
    },
];

export default defineFakeRoute([
    {
        url: '/get-routes',
        method: 'get',
        response: () => {
            return {
                code: 200,
                msg: '',
                data: [permissionRouter],
            };
        },
    },
]);
