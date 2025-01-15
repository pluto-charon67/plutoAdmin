import { defineFakeRoute } from 'vite-plugin-fake-server/client';

export default defineFakeRoute([
    {
        url: '/get-routes',
        method: 'get',
        response: () => {
            return {};
        },
    },
]);
