<script setup lang="ts">
import MoCodeEditor from './components/MoCodeEditor.vue';
import type { MoGridProps } from '@/components/grid/MoGrid.vue';
import type { API, ModelItem } from '@/api/auto-api-service';
import type { ParamItem } from '@/utils/handler-template';

/** 模型缓存 */
const modelCache = new Map<string, ModelItem>();

/** 类型选择项 */
const typeOptions = [
    { label: '查询', value: 'SELECT' },
    { label: '新增', value: 'INSERT' },
    { label: '修改', value: 'UPDATE' },
    { label: '删除', value: 'DELETE' }
];

/** 表组件参数 */
const gridProps: MoGridProps<Omit<API, '_id'> & { _id?: string }> = {
    toolbar: {
        buttons: ['add', 'deleteBatch']
    },
    table: {
        columns: [
            {
                prop: 'path',
                label: '接口地址',
                format: (row) =>
                    `/${row.module}/${row.model.replace(row.model[0], row.model[0].toLowerCase())}${row.path}`
            },
            {
                prop: 'type',
                label: '类型',
                format: (row) =>
                    row.customize ? '自定义' : typeOptions.find((item) => item.value === row.type)?.label || '-'
            },
            { prop: 'authorized', label: '是否验证', format: (row) => (row.authorized ? '是' : '否') },
            { prop: 'method', label: '请求方法' },
            { prop: 'status', label: '状态', format: (row) => (row.status ? '开启' : '关闭') },
            {
                prop: 'create_time',
                label: '创建时间',
                width: 170,
                format: (row) => new Date(row.create_time).toLocaleString()
            },
            {
                prop: 'update_time',
                label: '更新时间',
                width: 170,
                format: (row) => new Date(row.update_time).toLocaleString()
            }
        ],
        operations: ['delete', 'edit']
    },
    pagination: { limit: 10 },
    editDialog: {
        initData: {
            authorized: false,
            customize: false,
            type: 'SELECT',
            method: 'GET',
            success_message: '成功!',
            error_message: '失败!',
            status: true
        },
        components: [
            {
                type: 'select',
                name: 'module',
                label: '模块：',
                placeholder: '请选择模块',
                options: async () => {
                    const list = await autoApiService.module();
                    return list.map((item) => ({ label: item, value: item }));
                }
            },
            {
                type: 'select',
                name: 'model',
                label: '模型：',
                placeholder: '请选择模型',
                disabled: (editData) => editData.module === '',
                options: (() => {
                    const optionsCache = new Map<string, { label: string; value: string }[]>();
                    return async (editDataRef) => {
                        const module = editDataRef.value.module;
                        if (!module) {
                            editDataRef.value.model = '';
                            return [];
                        }
                        if (optionsCache.has(module)) {
                            return optionsCache.get(module)!;
                        }
                        const list = await autoApiService.model(module);
                        const options = list.map((item) => {
                            modelCache.set(module + '#' + item.name, item);
                            return { label: item.name, value: item.name };
                        });
                        optionsCache.set(module, options);
                        return options;
                    };
                })()
            },
            {
                type: 'input',
                name: 'path',
                label: '路径：',
                placeholder: '请输入路径'
            },
            {
                type: 'select',
                name: 'method',
                label: '请求方法：',
                options: [
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' }
                ]
            },
            {
                type: 'switch',
                name: 'authorized',
                label: '是否验证：'
            },
            {
                type: 'switch',
                name: 'customize',
                label: '自定义处理：'
            },
            {
                type: 'custom',
                name: 'raw_handler',
                label: '处理器：',
                component: MoCodeEditor,
                height: 500,
                placeholder: '请输入处理器',
                params: (editDataRef) => {
                    const module = editDataRef.value.module;
                    const model = editDataRef.value.model;
                    const modelItem = modelCache.get(module + '#' + model);
                    return { modelItem };
                },
                visible: (editData) => editData.customize === 'true'
            },
            {
                type: 'select',
                name: 'type',
                label: '类型：',
                options: typeOptions,
                visible: (editData) => editData.customize !== 'true'
            },
            {
                type: 'select',
                name: 'input_fields',
                label: '参数字段：',
                multiple: true,
                width: '100%',
                visible: (editData) => editData.customize !== 'true',
                disabled: (editData) => editData.model === '',
                options: async (editDataRef) => {
                    const model = editDataRef.value.model;
                    if (!model) {
                        return [];
                    }
                    const module = editDataRef.value.module;
                    const modelItem = await getModelItem(module, model);
                    return Object.keys(modelItem.schema).map((item) => ({
                        label: item,
                        value: item
                    }));
                }
            },
            {
                type: 'select',
                name: 'output_fields',
                label: '数据字段：',
                multiple: true,
                width: '100%',
                visible: (editData) => editData.customize !== 'true' && editData.type === 'SELECT',
                disabled: (editData) => editData.model === '',
                options: async (editDataRef) => {
                    const model = editDataRef.value.model;
                    if (!model) {
                        return [];
                    }
                    const module = editDataRef.value.module;
                    const modelItem = await getModelItem(module, model);
                    return Object.keys(modelItem.schema).map((item) => ({
                        label: item,
                        value: item
                    }));
                }
            },
            {
                type: 'input',
                name: 'where',
                label: '过滤条件：',
                placeholder: '请输入过滤条件',
                visible: (editData) =>
                    editData.customize !== 'true' && editData.type !== '' && editData.type !== 'INSERT'
            },
            {
                type: 'input',
                name: 'success_message',
                label: '成功消息：',
                placeholder: '请输入成功消息',
                visible: (editData) => editData.customize !== 'true'
            },
            {
                type: 'input',
                name: 'error_message',
                label: '失败消息：',
                placeholder: '请输入失败消息',
                visible: (editData) => editData.customize !== 'true'
            },
            {
                type: 'switch',
                name: 'status',
                label: '状态：',
                visible: (editData) => editData._id !== ''
            }
        ],
        rules: {
            module: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
            model: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
            path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
            handler: [{ required: true, message: '请输入处理器', trigger: 'blur' }]
        },
        watch: [
            (editDataRef) => {
                let input_fields: any = editDataRef.value.input_fields;
                let output_fields: any = editDataRef.value.output_fields;
                input_fields instanceof Array && (input_fields = input_fields.join(','));
                output_fields instanceof Array && (output_fields = output_fields.join(','));
                generateHandler({
                    module: editDataRef.value.module,
                    model: editDataRef.value.model,
                    type: editDataRef.value.type,
                    input_fields,
                    output_fields,
                    where: editDataRef.value.where,
                    success_message: editDataRef.value.success_message,
                    error_message: editDataRef.value.error_message
                }).then((handlerText) => (editDataRef.value.raw_handler = handlerText));
            }
        ],
        width: '80%',
        labelWidth: 110
    },
    api: {
        list: async () => {
            const list = await autoApiService.all();
            const total = list.length;
            return { list, total };
        },
        add: async ({
            module,
            model,
            path,
            authorized,
            customize,
            raw_handler,
            type,
            method,
            input_fields,
            output_fields,
            where,
            success_message,
            error_message
        }) => {
            const minifyHandler = (await minify(raw_handler)).code || '';
            if (customize === 'true') {
                await autoApiService.save({
                    module,
                    model,
                    path,
                    authorized: authorized === 'true',
                    method,
                    customize: true,
                    raw_handler,
                    handler: minifyHandler
                });
            } else {
                if (typeOptions.findIndex((item) => item.value === type) === -1) {
                    type = 'SELECT';
                }
                await autoApiService.save({
                    module,
                    model,
                    path,
                    authorized: authorized === 'true',
                    customize: false,
                    method,
                    raw_handler,
                    handler: minifyHandler,
                    type: type as any,
                    input_fields,
                    output_fields,
                    where,
                    success_message,
                    error_message
                });
            }
        },
        update: async ({
            _id,
            module,
            model,
            path,
            authorized,
            customize,
            raw_handler,
            type,
            method,
            input_fields,
            output_fields,
            where,
            success_message,
            error_message,
            status
        }) => {
            const minifyHandler = (await minify(raw_handler)).code || '';
            if (customize === 'true') {
                await autoApiService.update({
                    _id,
                    module,
                    model,
                    path,
                    authorized: authorized === 'true',
                    method,
                    customize: true,
                    raw_handler,
                    handler: minifyHandler,
                    status: status === 'true'
                });
            } else {
                if (typeOptions.findIndex((item) => item.value === type) === -1) {
                    type = 'SELECT';
                }
                await autoApiService.update({
                    _id,
                    module,
                    model,
                    path,
                    authorized: authorized === 'true',
                    customize: false,
                    method,
                    raw_handler,
                    handler: minifyHandler,
                    type: type as any,
                    input_fields,
                    output_fields,
                    where,
                    success_message,
                    error_message,
                    status: status === 'true'
                });
            }
        },
        remove: async ({ _id }) => {
            _id && (await autoApiService.remove(_id));
        },
        removeBatch: async (removeDatas) => {
            await autoApiService.remove(removeDatas.map((item) => item._id!));
        }
    }
};

/**
 * 生成处理器
 */
async function generateHandler({
    module = '',
    model = '',
    type = 'SELECT',
    input_fields = '',
    output_fields = '',
    where = '',
    success_message = '成功!',
    error_message = '失败!'
}: {
    /** 模块 */
    module?: string;
    /** 模型 */
    model?: string;
    /** 类型 */
    type?: string;
    /** 参数字段 */
    input_fields?: string;
    /** 数据字段 */
    output_fields?: string;
    /** 过滤条件 */
    where?: string;
    /** 成功信息 */
    success_message?: string;
    /** 错误信息 */
    error_message?: string;
}) {
    const params: ParamItem[] = [];
    if (input_fields !== '') {
        const paramFields = input_fields.split(',');
        const modelItem = await getModelItem(module, model);
        paramFields.forEach((field) => params.push({ name: field, type: modelItem?.schema[field] || '*' }));
    }
    if (type === 'SELECT') {
        const selectString = output_fields.replace(/,/g, ' ');
        return selectHandlerTemplate(params, selectString, where, success_message, error_message);
    }
    if (type === 'INSERT') {
        return insertHandlerTemplate(params, success_message, error_message);
    }
    if (type === 'UPDATE') {
        return updateHandlerTemplate(params, where, success_message, error_message);
    }
    if (type === 'DELETE') {
        return deleteHandlerTemplate(params, success_message, error_message);
    }
    return commonHandlerTemplate(params, 'let data = {};', success_message, error_message);
}

/**
 * 获取模型
 */
async function getModelItem(module: string, model: string): Promise<ModelItem> {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const modelItem = modelCache.get(module + '#' + model);
            if (modelItem) {
                resolve(modelItem);
                clearInterval(interval);
            }
        }, 500);
    });
}
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
