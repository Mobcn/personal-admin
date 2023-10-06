import service from '@/utils/request.ts';

/**
 * 用户接口地址
 */
export const userApi = {
    /**
     * 获取所有用户
     */
    all: '/blog/user/all',

    /**
     * 注册
     */
    register: '/blog/user/register',

    /**
     * 登录
     */
    login: '/blog/user/login',

    /**
     * 销毁
     */
    destroy: '/blog/user/destroy'
};

/**
 * 用户接口服务
 */
const userService = {
    /**
     * 获取所有用户
     *
     * @param params 参数
     */
    all: async () => service.get(userApi.all),

    /**
     * 注册
     *
     * @param username 用户名
     * @param password 密码
     */
    register: async (username: string, password: string) => service.post(userApi.register, { username, password }),

    /**
     * 登录
     *
     * @param username 用户名
     * @param password 密码
     */
    login: async (username: string, password: string): Promise<{ token: string }> => {
        return await service.post(userApi.login, { username, password });
    },

    /**
     * 销毁
     *
     * @param id 用户ID
     */
    destroy: async (id: string) => service.post(userApi.destroy, { id })
};

export default userService;
