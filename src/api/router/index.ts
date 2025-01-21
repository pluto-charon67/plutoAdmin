import http from '@/utils/http/index.ts';

export const getAsyncRoutes = () => http.get<Array<RouteConfig>>('/get-routes');
