import service from '@/utils/request.ts';

/**
 * 分类接口地址
 */
export const categoryApi = {
    /**
     * 获取所有分类
     */
    all: '/blog/category/all',

    /**
     * 添加分类
     */
    save: '/blog/category/save',

    /**
     * 删除分类
     */
    remove: '/blog/category/remove'
};

/**
 * 分类接口服务
 */
const categoryService = {
    /**
     * 获取所有分类
     */
    all: async () => service.get(categoryApi.all),

    /**
     * 添加分类
     *
     * @param name 名称
     * @param description 描述
     */
    save: async (name: string, description: string) => service.post(categoryApi.save, { name, description }),

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @returns Promise
     */
    remove: async (id: string) => service.post(categoryApi.remove, { _id: id })
};

export default categoryService;
