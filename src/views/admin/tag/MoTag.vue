<script setup lang="ts">
import type { MoGridProps } from '@/components/grid/MoGrid.vue';
import type { Article } from '@/api/article-service';

/** 表组件参数 */
const gridProps: MoGridProps<Article> = {
    search: {
        components: [
            {
                type: 'input',
                name: 'title',
                placeholder: '请输入文章标题'
            }
        ]
    },
    toolbar: {
        buttons: ['add', 'deleteBatch']
    },
    table: {
        columns: [
            { prop: 'title', label: '标题' },
            { prop: 'description', label: '描述' },
            { prop: 'content', label: '内容' }
        ]
    },
    pagination: { pageSize: 10 },
    editDialog: {
        components: [
            {
                type: 'input',
                name: 'title',
                label: '标题：',
                placeholder: '请输入标题'
            },
            {
                type: 'input',
                name: 'description',
                label: '描述：',
                placeholder: '请输入描述'
            },
            {
                type: 'input',
                name: 'content',
                label: '内容：',
                placeholder: '请输入内容'
            }
        ],
        rules: {
            title: [{ required: true, message: '请输入标题' }],
            description: [{ required: true, message: '请输入描述' }],
            content: [{ required: true, message: '请输入内容' }]
        },
        width: 400,
        labelWidth: 80
    },
    api: {
        list: async ({ page, pageSize }) => {
            const { list, total } = await articleService.list({ page, limit: pageSize });
            return { data: list, total };
        },
        add: async (addData) => {
            await articleService.save(addData);
        },
        remove: async (removeData) => {
            await articleService.remove(removeData._id);
        },
        removeBatch: async (removeDatas) => {
            await Promise.all(removeDatas.map((removeData) => articleService.remove(removeData._id)));
        },
        update: async (updateData) => {
            await articleService.update(updateData);
        }
    }
};
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
