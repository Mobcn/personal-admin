<script setup lang="ts">
import MoGrid from '@/components/grid/MoGrid.vue';
import type { MoGridProps } from '@/components/grid/MoGrid.vue';
import type { Category } from '@/api/category-service';

/** 表组件参数 */
const gridProps: MoGridProps<Category> = {
    toolbar: {
        buttons: ['add', 'deleteBatch']
    },
    table: {
        columns: [
            { prop: 'name', label: '名称' },
            { prop: 'description', label: '描述' }
        ],
        operations: ['delete']
    },
    pagination: { limit: 10 },
    editDialog: {
        components: [
            {
                type: 'input',
                name: 'name',
                label: '名称：',
                placeholder: '请输入名称'
            },
            {
                type: 'input',
                name: 'description',
                label: '描述：',
                placeholder: '请输入描述'
            }
        ],
        rules: {
            name: [{ required: true, message: '请输入名称' }],
            description: [{ required: true, message: '请输入描述' }]
        },
        width: 400,
        labelWidth: 80
    },
    api: {
        list: async ({ page, limit }) => categoryService.list(page, limit),
        add: async ({ name, description }) => {
            await categoryService.save(name, description);
        },
        remove: async ({ _id }) => {
            await categoryService.remove(_id);
        },
        removeBatch: async (removeDatas) => {
            await categoryService.remove(removeDatas.map((item) => item._id).join(','));
        }
    }
};
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
