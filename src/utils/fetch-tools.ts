/**
 * 查询参数
 */
interface QueryParams {
    [key: string]: string | number | string[] | number[];
}

/**
 * JSON参数
 */
interface JSONParams {
    [key: string]: string | number | boolean | string[] | number[] | boolean[] | JSONParams;
}

/**
 * 请求设置参数
 */
type RequestOptions = Omit<RequestInit, 'body'> & {
    /** 基础路径 */
    baseURL?: string;
    /** 请求超时时间 */
    timeout?: number;
    /** 请求体 */
    body?: QueryParams | JSONParams | BodyInit | null;
};

/** 请求设置参数及URL */
type RequestOptionsWithURL = RequestOptions & { url: string };

/** 响应数据 */
type ResponseData = any;

/** Promise及值 */
type PromiseOrValue<T> = T | Promise<T>;

/**
 * 请求拦截器
 */
type RequestInterceptor = (optionsWithURL: RequestOptionsWithURL) => PromiseOrValue<RequestOptionsWithURL>;

/**
 * 响应拦截器
 */
type ResponseInterceptor<T = ResponseData> = (data: T, response: Response) => PromiseOrValue<T>;

/**
 * 错误响应拦截器
 */
type ResponseErrorInterceptor<T = ResponseData> = (
    response: Response,
    options: RequestOptions,
    data?: T
) => T | Promise<T>;

/** 默认请求设置参数 */
const defaultOptions: RequestOptions = {
    headers: {
        'Content-Type': 'application/json'
    }
};
/** 基础请求设置参数 */
let baseOptions: RequestOptions = { ...defaultOptions };

/** 请求拦截器数组 */
const requestInterceptors: RequestInterceptor[] = [];
/** 响应拦截器数组 */
const responseInterceptors: ResponseInterceptor[] = [];
/** 响应错误拦截器数组 */
const responseErrorInterceptors: ResponseErrorInterceptor[] = [];

/**
 * GET请求
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求设置参数
 */
export async function $get<T = any>(url: string, params?: QueryParams, options?: RequestOptions) {
    return $request<T>(url, { ...options, body: params, method: 'GET' });
}

/**
 * POST请求
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求设置参数
 */
export async function $post<T = any>(url: string, body?: JSONParams, options?: RequestOptions) {
    return $request<T>(url, { ...options, body, method: 'POST' });
}

/**
 * PUT请求
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求设置参数
 */
export async function $put<T = any>(url: string, body?: JSONParams, options?: RequestOptions) {
    return $request<T>(url, { ...options, body, method: 'PUT' });
}

/**
 * PATCH请求
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求设置参数
 */
export async function $patch<T = any>(url: string, body?: JSONParams, options?: RequestOptions) {
    return $request<T>(url, { ...options, body, method: 'PATCH' });
}

/**
 * DELETE请求
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param options 请求设置参数
 */
export async function $delete<T = any>(url: string, params?: QueryParams, options?: RequestOptions) {
    return $request<T>(url, { ...options, body: params, method: 'DELETE' });
}

/**
 * 发起请求
 *
 * @param url 请求地址
 * @param options 请求设置参数
 */
export async function $request<T = any>(url: string, options?: RequestOptions) {
    // 执行请求拦截
    const params = { ...baseOptions, ...options, url };
    const reqNext = (pre: RequestOptionsWithURL) => [pre] as [RequestOptionsWithURL];
    let { url: _url, ...opts } = await _sequenceTasks(requestInterceptors, reqNext, params);

    // 参数
    const { baseURL, timeout, body: _body, ..._opts } = opts;
    const _options: RequestInit = _opts;

    // 添加超时控制
    if (timeout && timeout > 0) {
        const controller = new AbortController();
        _options.signal && (_options.signal.onabort = (e) => controller.abort(e));
        _options.signal = controller.signal;
        setTimeout(() => controller.abort('timeout!'), timeout);
    }

    // 请求参数处理
    if (_body) {
        const method = _options.method || 'GET';
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            // 设置body
            _options.body = _resolveBody(_body, (_options.headers = new Headers(_options.headers)));
        } else if (typeof _body === 'object') {
            // 设置地址栏参数
            const $url = new URL(_url, baseURL);
            _mergeURLParams($url.searchParams, _body as QueryParams);
            _url = $url.toString();
        }
    }

    // 发起请求
    const response = await fetch(new URL(_url, baseURL), _options);

    // 执行错误响应拦截
    if (response.status !== 200) {
        const errNext = (pre: ResponseData) => [response, _options, pre] as [Response, RequestOptions, ResponseData];
        const data = await _sequenceTasks(responseErrorInterceptors, errNext, response, _options);
        return data as T;
    }

    // 执行响应拦截
    const resNext = (pre: ResponseData) => [pre, response] as [ResponseData, Response];
    const data = await _sequenceTasks(responseInterceptors, resNext, await _parseResponseData(response), response);
    return data as T;
}

/**
 * 加载文件文本
 *
 * @param url 请求地址
 * @param options 请求设置参数
 */
export async function $loadFileText(url: string, options?: RequestOptions) {
    return $request<string>(url, options);
}

/**
 * 加载文件JSON
 *
 * @param url 请求地址
 * @param options 请求设置参数
 */
export async function $loadFileJSON<T>(url: string, options?: RequestOptions) {
    const text = await $request<string>(url, options);
    return JSON.parse(text) as T;
}

/**
 * 设置基础请求设置参数
 *
 * @param options 请求设置参数
 */
export function $setBaseOptions(options: RequestOptions) {
    baseOptions = { ...defaultOptions, ...options };
}

/**
 * 添加请求拦截器
 *
 * @param interceptor 请求拦截器
 */
export function $addRequestInterceptor(interceptor: RequestInterceptor) {
    requestInterceptors.push(interceptor);
}

/**
 * 添加响应拦截器
 *
 * @param interceptor 响应拦截器
 */
export function $addResponseInterceptor<T = ResponseData>(interceptor: ResponseInterceptor<T>) {
    responseInterceptors.push(interceptor);
}

/**
 * 添加错误响应拦截器
 *
 * @param errorInterceptor 错误响应拦截器
 */
export function $addResponseErrorInterceptor<T = ResponseData>(errorInterceptor: ResponseErrorInterceptor<T>) {
    responseErrorInterceptors.push(errorInterceptor);
}

/**
 * 顺序执行任务
 *
 * @param tasks 任务函数列表
 * @param next 根据上一个任务值获取下一个任务参数函数
 * @param init 任务初始参数
 */
async function _sequenceTasks<T, K extends any[]>(
    tasks: ((...args: K) => PromiseOrValue<T>)[],
    next: (preValue: T) => PromiseOrValue<K>,
    ...init: K
) {
    const run = tasks.reduce((pre, cur) => async (...args: K) => {
        const preValue = await pre.apply(null, args);
        const newArgs = await next.call(null, preValue);
        return cur.apply(null, newArgs);
    });
    return run.apply(null, init);
}

/**
 * 合并地址栏参数
 *
 * @param query 查询参数对象
 * @param params 查询参数
 */
function _mergeURLParams(query: URLSearchParams, params: QueryParams) {
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
            return;
        }
        const isArray = value instanceof Array;
        const valueType = isArray ? (value.length ? typeof value[0] : 'string') : typeof value;
        if (valueType !== 'string' && valueType !== 'number') {
            throw new Error('URL 格式参数只能为 string 或 number');
        }
        if (isArray) {
            value.forEach((v) => query.append(key, v.toString()));
        } else {
            query.append(key, value.toString());
        }
    });
}

/**
 * 处理请求体
 *
 * @param body 请求体
 * @param headers 请求头
 */
function _resolveBody(body: QueryParams | JSONParams | BodyInit, headers: Headers) {
    // 字符串类型直接返回
    if (typeof body === 'string') {
        return body;
    }

    // 特殊类型直接返回，删除 Content-Type 让 fetch 自动判断生成
    if (
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof ReadableStream ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body)
    ) {
        headers.delete('Content-Type');
        return body;
    }

    // 获取 Content-Type，默认为 application/json
    let contentType = headers.get('Content-Type');
    contentType ??= new Headers(defaultOptions.headers).get('Content-Type');
    contentType ??= 'application/json';

    // URL 格式处理
    if (contentType === 'application/x-www-form-urlencoded') {
        const query = new URLSearchParams();
        _mergeURLParams(query, body as QueryParams);
        return query.toString();
    }

    return JSON.stringify(body);
}

/**
 * 解析响应对象数据
 *
 * @param response 响应对象
 */
async function _parseResponseData(response: Response): Promise<ResponseData> {
    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.startsWith('application/json')) {
        return response.json();
    }
    if (contentType.startsWith('application/octet-stream')) {
        return response.blob();
    }
    return response.text();
}
