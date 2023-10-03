<script setup lang="ts">
import type { MoGridProps } from '@/components/grid/MoGrid.vue';

/** 行数据类型 */
type RowVO = {
    name: string;
    age: number;
};

/** 表组件参数 */
const gridProps: MoGridProps<RowVO> = {
    search: {
        components: [
            {
                type: 'input',
                name: 'name',
                placeholder: '请输入名称'
            },
            {
                type: 'select',
                name: 'age',
                multiple: true,
                options: [
                    { value: '1', label: '选项1' },
                    { value: '2', label: '选项2' }
                ],
                placeholder: '请选择选项'
            }
        ]
    },
    toolbar: {
        buttons: ['add', 'deleteBatch']
    },
    table: {
        columns: [
            { prop: 'name', label: '名称' },
            { prop: 'age', label: '年龄' }
        ]
    },
    pagination: { pageSize: 10 },
    api: {
        list: () => [
            { name: '张三', age: 18 },
            { name: '李四', age: 20 }
        ],
        add: () => true,
        remove: () => true,
        removeBatch: () => true,
        update: () => true
    }
};
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
