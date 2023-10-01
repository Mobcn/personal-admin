import FetchService from './FetchService';
import storage from './storage';

// token刷新地址
const refreshURL = '/blog/user/login';

// 创建一个fetch服务实例
const service = FetchService.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
});

// 请求拦截器
service.addRequestInterceptor((_url, options) => {
    const token = storage.get('token');
    if (token) {
        // 配置登录认证token
        options.headers = new Headers(options.headers);
        options.headers.append('Authorization', 'Bearer ' + token);
    }
});

// 响应拦截器
service.addResponseInterceptor((responseData) => {
    return responseData.data;
});

// 响应错误拦截器
service.setResponseErrorInterceptor(async (response, options) => {
    if (response.status !== 401) {
        throw new Error(response.statusText);
    }
    const { pathname } = new URL(response.url);
    if (pathname === refreshURL) {
        throw new Error(response.statusText);
    }
    // 刷新token
    let responseData = await service.post(refreshURL);
    storage.set('token', responseData.data.token);
    // 重试
    // @ts-ignore
    return await service[options.method!.toLowerCase()](response.url, undefined, options);
});

export default service;
