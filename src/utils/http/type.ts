import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    Method,
    AxiosError,
    InternalAxiosRequestConfig,
    CreateAxiosDefaults,
} from 'axios';

// 自定义的拦截器
export interface CustomInterceptors<T = any> {
    requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig; // 请求拦截的成功回调
    requestErrorFn?: (err: any) => any; // 请求拦截的失败回调
    responseSuccessFn?: (res: AxiosResponse<T, any>) => any; // 响应拦截的成功回调
    responseErrorFn?: (err: any) => any; // 响应拦截的失败回调
}

// 为每个axios实例配置自定义的全局拦截器
export interface CustomRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: CustomInterceptors<T>;
}

// 与后端约定的接口数据返回结构
export interface ResponseData<T = any> {
    code: number; // 状态码
    msg: string; // 接口成功或失败的提示信息
    data: T;
    // 列表结构
    rows: Array<T>;
    total: number;
}

// axios响应
export type AxiosResponseData<T = any, D = any> = AxiosResponse<ResponseData<T>, D>;

export { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method, AxiosError, InternalAxiosRequestConfig };
