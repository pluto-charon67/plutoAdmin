import { defineFakeRoute } from 'vite-plugin-fake-server/client';

export default defineFakeRoute([
    {
        url: '/login',
        method: 'post',
        response: ({ body }) => {
            const { username = '' } = body;
            if (username === 'admin') {
                return {
                    code: 200,
                    msg: '',
                    data: {
                        avatar: 'https://picsum.photos/200',
                        username: 'admin',
                        nickname: 'pluto',
                        roles: ['admin'], // 一个人可能有多个角色
                        permissions: ['*:*:*'],
                        accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin',
                        refreshToken: 'eyJhbGciOiJIUzUxMiJ9.adminRefresh',
                        expires: '2030/10/30 00:00:00',
                    },
                };
            } else {
                return {
                    code: 200,
                    msg: '',
                    data: {
                        avatar: 'https://picsum.photos/200',
                        username: 'common',
                        nickname: '普通用户',
                        roles: ['common'], // 一个人可能有多个角色
                        permissions: ['permission:btn:add', 'permission:btn:edit'],
                        accessToken: 'eyJhbGciOiJIUzUxMiJ9.common',
                        refreshToken: 'eyJhbGciOiJIUzUxMiJ9.commonRefresh',
                        expires: '2030/10/30 00:00:00',
                    },
                };
            }
        },
    },
    {
        url: '/refresh-token',
        method: 'post',
        response: ({ body }) => {
            if (body.refreshToken) {
                return {
                    code: 200,
                    msg: '',
                    data: {
                        accessToken: 'eyJhbGciOiJIUzUxMiJ9.newAdmin',
                        refreshToken: 'eyJhbGciOiJIUzUxMiJ9.newAdminRefresh',
                        expires: '2030/10/30 23:59:59',
                    },
                };
            } else {
                return {
                    code: 401,
                    msg: '登录过期，请重新登录',
                    data: null,
                };
            }
        },
    },
]);
