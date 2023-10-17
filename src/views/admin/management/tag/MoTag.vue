<script setup lang="ts">
import type { MoGridProps } from '@/components/grid/MoGrid.vue';
import type { Tag } from '@/api/tag-service';

/** 表组件参数 */
const gridProps: MoGridProps<Tag> = {
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
        list: async ({ page, limit }) => tagService.list(page, limit),
        add: async ({ name, description }) => {
            await tagService.save(name, description);
        },
        remove: async ({ _id }) => {
            await tagService.remove(_id);
        },
        removeBatch: async (removeDatas) => {
            await tagService.remove(removeDatas.map((item) => item._id).join(','));
        }
    }
};
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
