import service from '@/utils/request.ts';

/**
 * 标签接口地址
 */
export const tagApi = {
    /**
     * 获取所有标签
     */
    all: '/blog/category/all',

    /**
     * 添加标签
     */
    save: '/blog/category/save',

    /**
     * 删除标签
     */
    remove: '/blog/category/remove'
};

/**
 * 标签接口服务
 */
const tagService = {
    /**
     * 获取所有标签
     *
     * @param params 参数
     */
    all: async () => service.get(tagApi.all),

    /**
     * 添加标签
     *
     * @param name 名称
     * @param description 描述
     */
    save: async (name: string, description: string) => service.post(tagApi.save, { name, description }),

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @returns Promise
     */
    remove: async (id: string) => service.post(tagApi.remove, { _id: id })
};

export default tagService;
