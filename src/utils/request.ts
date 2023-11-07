import storage from './storage';
import patchFetch from './patch-fetch';
import type {
    QueryParams,
    JSONParams,
    RequestOptions,
    RequestInterceptor,
    ResponseInterceptor,
    ResponseErrorInterceptor,
    InterceptorConfig
} from './patch-fetch';

// token刷新地址
const refreshURL = '/blog/user/login';

// 请求设置参数
const options: RequestOptions = {
    baseURL: 'http://localhost:5173',
    timeout: 5000
};

// 请求拦截器
const requestInterceptors: RequestInterceptor[] = [
    (config) => {
        const token = storage.get('token');
        if (token) {
            // 配置登录认证token
            config.headers = new Headers(config.headers);
            config.headers.set('Authorization', 'Bearer ' + token);
        }
        return config;
    }
];

// 响应拦截器
const responseInterceptors: ResponseInterceptor[] = [
    async (_, response) => {
        const { code, message, data } = await response.json();
        if (code !== 0) {
            throw new Error(message);
        }
        return data;
    }
];

// 响应错误拦截器
const responseErrorInterceptors: ResponseErrorInterceptor[] = [
    async (response, options) => {
        if (response.status !== 401) {
            throw new Error(response.statusText);
        }
        const { pathname } = new URL(response.url);
        if (pathname === refreshURL) {
            throw new Error(response.statusText);
        }
        // 刷新token
        let { token } = await service.post(refreshURL);
        storage.set('token', token);
        // 重试
        return patchFetch(response.url, { ...inerceptorConfig, ...options });
    }
];

// 拦截器设置
const inerceptorConfig: InterceptorConfig = { requestInterceptors, responseInterceptors, responseErrorInterceptors };
// 参数设置
const config = { ...options, ...inerceptorConfig };

/**
 * 请求服务
 */
const service = {
    /**
     * GET请求
     */
    get: async <T = any>(url: string, params?: QueryParams): Promise<T> => {
        return patchFetch.get(url, { ...config, body: params });
    },

    /**
     * POST请求
     */
    post: async <T = any>(url: string, body?: JSONParams): Promise<T> => {
        return patchFetch.post(url, { ...config, body });
    }
};

export default service;
