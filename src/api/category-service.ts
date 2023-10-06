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
     * 获取分类分页列表
     */
    list: '/blog/category/list',

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
    all: async (): Promise<Category[]> => service.get(categoryApi.all),

    /**
     * 获取分类分页列表
     *
     * @param page 页码
     * @param limit 每页数据条数
     */
    list: async (page: number | string, limit: number | string): Promise<{ list: Category[]; total: number }> => {
        return service.get(categoryApi.list, { page, limit });
    },

    /**
     * 添加分类
     *
     * @param name 名称
     * @param description 描述
     */
    save: async (name: string, description: string): Promise<Category> => {
        return service.post(categoryApi.save, { name, description });
    },

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @returns Promise
     */
    remove: async (id: string): Promise<Category> => service.post(categoryApi.remove, { _id: id })
};

export default categoryService;

/**
 * 分类
 */
export type Category = {
    /** ID */
    _id: string;
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
};
