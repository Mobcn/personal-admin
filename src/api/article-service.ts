import service from '@/utils/request.ts';

/**
 * 获取文章列表参数
 */
type ArticleListParams = {
    /** 模糊查询key */
    key?: string;
    /** 文章创建时间起始时间 */
    startTime?: Date;
    /** 文章创建时间截止时间 */
    endTime?: Date;
    /** 分类ID数组 */
    categories?: string[];
    /** 标签ID数组 */
    tags?: string[];
    /** 作者ID */
    author?: string;
    /** 页码 */
    page?: string;
    /** 每页数据条数 */
    limit?: string;
};

/**
 * 添加文章参数
 */
type ArticleSaveParams = {
    /** 标题 */
    title: string;
    /** 描述 */
    description?: string;
    /** 内容 */
    content?: string;
    /** 封面地址 */
    cover?: string;
    /** 分类ID */
    category?: string;
    /** 标签ID数组 */
    tags?: string[];
};

/**
 * 更新文章参数
 */
type ArticleUpdateParams = Omit<ArticleSaveParams, 'title'> & {
    /** 文章ID */
    _id: string;
    /** 标题 */
    title?: string;
    /** 置顶时间 */
    top_time?: Date;
    /** 状态 */
    status?: number;
};

/**
 * 文章接口地址
 */
export const articleApi = {
    /**
     * 获取文章列表
     */
    list: '/blog/article/list',

    /**
     * 获取文章信息
     */
    get: '/blog/article/get',

    /**
     * 添加文章
     */
    save: '/blog/article/save',

    /**
     * 更新文章
     */
    update: '/blog/article/update',

    /**
     * 删除文章
     */
    remove: '/blog/article/remove'
};

/**
 * 文章接口服务
 */
const articleService = {
    /**
     * 获取文章列表
     *
     * @param params 参数
     * @param page 页码
     * @param limit 每页数据条数
     */
    list: async (params: ArticleListParams) => {
        const _params: any = { ...params };
        params.startTime && (_params.startTime = params.startTime.toISOString());
        params.endTime && (_params.startTime = params.endTime.toISOString());
        params.categories && (_params.categories = params.categories.join(','));
        params.tags && (_params.tags = params.tags.join(','));
        return service.get(articleApi.list, _params);
    },

    /**
     * 获取文章信息
     *
     * @param id 文章ID
     */
    get: async (id: string) => service.get(articleApi.get, { _id: id }),

    /**
     * 添加文章
     *
     * @param params 参数
     */
    save: async (params: ArticleSaveParams) => {
        const _params: any = { ...params };
        params.tags && (_params.tags = params.tags.join(','));
        return service.post(articleApi.save, params);
    },

    /**
     * 更新文章
     *
     * @param params 参数
     */
    update: async (params: ArticleUpdateParams) => {
        const _params: any = { ...params };
        params.tags && (_params.tags = params.tags.join(','));
        params.top_time && (_params.top_time = params.top_time.toISOString());
        params.status !== undefined && (_params.status = String(params.status));
        return service.post(articleApi.update, _params);
    },

    /**
     * 删除文章
     *
     * @param id 文章ID
     */
    remove: async (id: string) => service.post(articleApi.remove, { _id: id })
};

export default articleService;
