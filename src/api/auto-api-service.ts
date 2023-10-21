import service from '@/utils/request.ts';

/**
 * 自动接口地址
 */
export const autoApi = {
    /**
     * 获取所有自动接口
     */
    all: '/auto/all',

    /**
     * 添加自动接口
     */
    save: '/auto/save',

    /**
     * 修改自动接口
     */
    update: '/auto/update',

    /**
     * 删除自动接口
     */
    remove: '/auto/remove',

    /**
     * 获取所有模块
     */
    module: '/auto/module',

    /**
     * 获取模块下所有模型
     */
    model: '/auto/model'
};

/**
 * 自动接口服务
 */
const autoApiService = {
    /**
     * 获取所有标签
     */
    all: async (): Promise<API[]> => service.get(autoApi.all),

    /**
     * 添加自动接口
     *
     * @param data 接口添加信息
     */
    save: async (data: SaveAPI): Promise<API> => {
        return service.post(autoApi.save, data);
    },

    /**
     * 修改自动接口
     *
     * @param data 接口修改信息
     */
    update: async (data: UpdateAPI): Promise<API> => {
        console.log(data);
        
        return service.post(autoApi.update, data);
    },

    /**
     * 删除自动接口
     *
     * @param _id 自动接口ID
     */
    remove: async (_id: string | string[]): Promise<API> => service.post(autoApi.remove, { _id }),

    /**
     * 获取所有模块
     */
    module: async (): Promise<string[]> => service.get(autoApi.module),

    /**
     * 获取模块下所有模型
     */
    model: async (module: string): Promise<ModelItem[]> => service.get(autoApi.model, { module })
};

export default autoApiService;

/**
 * 自动接口保存
 */
type SaveAPI = {
    /** 模块 */
    module: string;
    /** 模型 */
    model: string;
    /** 路径 */
    path: string;
    /** 是否认证 */
    authorized: boolean;
    /** 请求方法 */
    method: string;
    /** 处理器 */
    handler: string;
} & (
    | {
          /** 是否自定义 */
          customize: true;
      }
    | {
          /** 是否自定义 */
          customize: false;
          /** 类型 */
          type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
          /** 成功消息 */
          success_message: string;
          /** 错误消息 */
          error_message: string;
          /** 输入参数字段 */
          input_fields?: string;
          /** 输出数据字段 */
          output_fields?: string;
          /** 过滤条件 */
          where?: string;
      }
);

/**
 * 自动接口更新
 */
type UpdateAPI = SaveAPI & {
    /** ID */
    _id: string;
    /** 状态 */
    status: boolean;
};

/**
 * 模型项
 */
export type ModelItem = {
    /** 模型名称 */
    name: string;
    /** 模型属性结构 */
    schema: { [x: string]: 'String' | 'Number' | 'Boolean' | 'Date' };
};

/**
 * 自动接口
 */
export type API = {
    /** ID */
    _id: string;
    /** 模块 */
    module: string;
    /** 模型 */
    model: string;
    /** 路径 */
    path: string;
    /** 是否认证 */
    authorized: boolean;
    /** 请求方法 */
    method: string;
    /** 处理器 */
    handler: string;
    /** 是否自定义 */
    customize: boolean;
    /** 类型 */
    type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    /** 成功消息 */
    success_message: string;
    /** 错误消息 */
    error_message: string;
    /** 状态 */
    status: boolean;
    /** 创建时间 */
    create_time: string;
    /** 更新时间 */
    update_time: string;
    /** 输入参数字段 */
    input_fields?: string;
    /** 输出数据字段 */
    output_fields?: string;
    /** 过滤条件 */
    where?: string;
};
