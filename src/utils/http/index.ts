import Request from './request.ts';
import type { ResponseData } from './type.ts';

const defaultRequestOptions = {
    baseURL: '',
    timeout: 1000 * 5,
    headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // 跨域凭证
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
    paramsSerializer(params) {
        return stringify(params, { arrayFormat: 'repeat' });
    },
};

export { ResponseData, defaultRequestOptions };

export default new Request(defaultRequestOptions);
