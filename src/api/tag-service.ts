import service from '@/utils/request.ts';

/**
 * 标签接口地址
 */
export const tagApi = {
    /**
     * 获取所有标签
     */
    all: '/blog/tag/all',

    /**
     * 获取标签分页列表
     */
    list: '/blog/tag/list',

    /**
     * 添加标签
     */
    save: '/blog/tag/save',

    /**
     * 删除标签
     */
    remove: '/blog/tag/remove'
};

/**
 * 标签接口服务
 */
const tagService = {
    /**
     * 获取所有标签
     */
    all: async (): Promise<Tag[]> => service.get(tagApi.all),

    /**
     * 获取标签分页列表
     *
     * @param page 页码
     * @param limit 每页数据条数
     */
    list: async (page: number | string, limit: number | string): Promise<{ list: Tag[]; total: number }> => {
        return service.get(tagApi.list, { page, limit });
    },

    /**
     * 添加标签
     *
     * @param name 名称
     * @param description 描述
     */
    save: async (name: string, description: string): Promise<Tag> => {
        return service.post(tagApi.save, { name, description });
    },

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @returns Promise
     */
    remove: async (id: string): Promise<Tag> => service.post(tagApi.remove, { _id: id })
};

export default tagService;

/**
 * 标签
 */
export type Tag = {
    /** ID */
    _id: string;
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
};
