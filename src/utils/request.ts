import storage from './storage';
import * as FetchTools from './fetch-tools';

// token刷新地址
const refreshURL = '/blog/user/login';

// 创建一个fetch服务实例
FetchTools.$setBaseOptions({
    baseURL: 'http://localhost:5173',
    timeout: 5000
});

// 请求拦截器
FetchTools.$addRequestInterceptor((config) => {
    const token = storage.get('token');
    if (token) {
        // 配置登录认证token
        config.headers = new Headers(config.headers);
        config.headers.set('Authorization', 'Bearer ' + token);
    }
    return config;
});

// 响应拦截器
FetchTools.$addResponseInterceptor((responseData) => {
    const { code, message, data } = responseData;
    if (code !== 0) {
        throw new Error(message);
    }
    return data;
});

// 响应错误拦截器
FetchTools.$addResponseErrorInterceptor(async (response, options) => {
    if (response.status !== 401) {
        throw new Error(response.statusText);
    }
    const { pathname } = new URL(response.url);
    if (pathname === refreshURL) {
        throw new Error(response.statusText);
    }
    // 刷新token
    let { token } = await FetchTools.$post(refreshURL);
    storage.set('token', token);

    // 重试
    return FetchTools.$request(response.url, options);
});

const service = {
    get: FetchTools.$get,
    post: FetchTools.$post,
    put: FetchTools.$put,
    delete: FetchTools.$delete,
    patch: FetchTools.$patch
};

export default service;
