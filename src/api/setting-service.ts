import service from '@/utils/request.ts';

/**
 * 添加设置项参数
 */
type ArticleSettingParams = {
    /** 键 */
    key: string;
    /** 值 */
    value: string;
    /** 是否为公共设置项 */
    is_public?: boolean;
    /** 描述 */
    description?: string;
};

/**
 * 设置接口地址
 */
export const settingApi = {
    /**
     * 获取设置项列表
     */
    list: '/blog/setting/list',

    /**
     * 添加设置项
     */
    save: '/blog/setting/save',

    /**
     * 更新设置项
     */
    remove: '/blog/setting/remove'
};

/**
 * 设置接口服务
 */
const settingService = {
    /**
     * 获取设置项列表
     */
    list: async () => service.get(settingApi.list),

    /**
     * 添加设置项
     *
     * @param params 参数
     * @returns Promise
     */
    save: async (params: ArticleSettingParams) => {
        const _params: any = { ...params };
        params.is_public !== undefined && (_params.is_public = String(params.is_public));
        return service.post(settingApi.save, _params);
    },

    /**
     * 删除设置项
     *
     * @param id 分类ID
     * @returns Promise
     */
    remove: async (id: string) => service.post(settingApi.remove, { _id: id })
};

export default settingService;
