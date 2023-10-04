<script setup lang="ts">
import type { MoGridProps } from '@/components/grid/MoGrid.vue';

/** 行数据类型 */
type RowVO = {
    _id: string;
    name: string;
    age: number;
};

const data: RowVO[] = [
    { _id: '1', name: '张三', age: 18 },
    { _id: '2', name: '李四', age: 20 }
];

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
                name: 'age',
                label: '年龄：',
                placeholder: '请输入年龄'
            }
        ],
        rules: {
            name: [{ required: true, message: '请输入名称' }]
        },
        width: 400,
        labelWidth: 80
    },
    api: {
        list: ({ page, pageSize }) => ({
            data: data.slice((page - 1) * pageSize, page * pageSize),
            total: data.length
        }),
        add: (addData) => {
            data.push({
                _id: String(data.length + 1),
                name: addData.name,
                age: Number(addData.age)
            });
        },
        remove: (removeData) => {
            data.splice(
                data.findIndex((item) => item._id === removeData._id),
                1
            );
        },
        removeBatch: (removeDatas) => {
            const ids = removeDatas.map((item) => item._id);
            for (let index = data.length - 1; index >= 0; index--) {
                if (ids.includes(data[index]._id)) {
                    data.splice(index, 1);
                }
            }
        },
        update: (updateData) => {
            const target = data.find((item) => item._id === updateData._id);
            if (target) {
                target.name = updateData.name;
                target.age = Number(updateData.age);
            }
        }
    }
};
</script>

<template>
    <mo-grid v-bind="gridProps"></mo-grid>
</template>

<style scoped></style>
