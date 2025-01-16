import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, CustomRequestConfig, ResponseData, AxiosResponseData } from './type.ts';

const whiteList = []; // 不需要token的白名单

class Request {
    private instance: AxiosInstance; // 当前axios的实例对象

    private initConfig: CustomRequestConfig; // 实例化的初始配置对象

    private isRefreshing = false; // 是否正在刷新token，在双token模式使用，避免重复刷新

    private requestList = []; // 需要重发的请求

    constructor(config: CustomRequestConfig) {
        this.initConfig = config;

        this.instance = axios.create(config);
        // 设置请求拦截
        this.setRequestInterceptors();
        // 设置响应拦截
        this.setResponseInterceptors();
    }

    setRequestInterceptors() {
        const initConfig = this.initConfig;
        const customInterceptors = initConfig?.interceptors;

        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (customInterceptors) {
                    // 自定义的请求实例的请求成功拦截
                    customInterceptors.requestSuccessFn(config);
                    return config;
                }

                // 未设置当前实例的请求成功拦截则执行默认的请求拦截
                const { url } = config;
                // 当前请求是否需要携带token
                const isPortToken = whiteList.includes(url);
                // 以下是设置token等请求前置操作
                return config;
            },
            err => {
                // 请求实例自定义的请求拦截的错误回调
                if (customInterceptors) return customInterceptors.requestErrorFn(err);
                console.log('全局请求拦截失败', err);
            }
        );
    }

    setResponseInterceptors() {
        const initConfig = this.initConfig;
        const customInterceptors = initConfig?.interceptors;

        this.instance.interceptors.response.use(res => {
            if (customInterceptors) return customInterceptors.responseSuccessFn(res); // 当前实例自定义的响应拦截

            const data = res.data as ResponseData;
            const { code } = data;

            if (code === 200) return data; // 请求成功

            return this.httpErrorHandler(res); // 异常处理
        });
    }

    httpErrorHandler(res: AxiosResponseData) {
        const data = res.data;
        const config = res.config;
        const { code, msg } = data;

        switch (code) {
            case 401:
                // 未登录或登录过期
                break;
            case 403:
                // 无权限
                break;
            default:
                console.log('其他错误清空');
        }
    }

    request<T>(config: CustomRequestConfig): Promise<ResponseData<T>> {
        const interceptors = config.interceptors;
        if (interceptors) {
            // 对单次请求的请求成功拦截
            config = interceptors.requestSuccessFn(config);
        }

        return new Promise((resolve, reject) => {
            this.instance
                .request<any, ResponseData<T>>(config)
                .then(res => {
                    // 单次请求的响应拦截
                    if (interceptors) res = interceptors.responseSuccessFn(res as any);
                    resolve(res);
                })
                .catch(err => reject(err));
        });
    }

    get<T = any>(url: string, config?: CustomRequestConfig) {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    post<T = any>(url: string, config?: CustomRequestConfig) {
        return this.request<T>({ ...config, method: 'POST', url });
    }

    put<T = any>(url: string, config?: CustomRequestConfig) {
        return this.request<T>({ ...config, method: 'PUT', url });
    }

    delete<T = any>(url: string, config?: CustomRequestConfig) {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }
}

export default Request;
