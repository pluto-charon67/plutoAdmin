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
                    data: {},
                };
            }
        },
    },
]);
