<script setup lang="ts" generic="T">
import type { MoSearchProps, SearchData } from './components/MoSearch.vue';
import type { MoToolbarProps } from './components/MoToolbar.vue';
import type { MoTableProps, MoTableInstance } from './components/MoTable.vue';

/** 参数 */
const props = defineProps<MoGridProps<T>>();

/** 表格元素对象 */
const moTableRef = ref<MoTableInstance<T>>();

/** 表格数据 */
const data = ref([]) as Ref<T[]>;

/** 当前页码 */
const page = ref(1);
/** 总数据条数 */
const total = ref(0);

/** 查询事件 */
const searchEvent = (searchData: SearchData<keyof T>) => {
    console.log(searchData);
};
/** 添加事件 */
const addEvent = () => {
    console.log('添加');
};
/** 删除事件 */
const deleteEvent = (row: T) => {
    console.log(row);
    console.log('删除');
};
/** 批量删除事件 */
const deleteBatchEvent = () => {
    const $table = moTableRef.value;
    if ($table) {
        const rows = $table.getSelectionRows();
        console.log(rows);
        console.log('批量删除');
    }
};
/** 编辑事件 */
const editEvent = (row: T) => {
    console.log(row);
    console.log('编辑');
};
/** 页码修改事件 */
const pageChangeEvent = (value: number) => {
    page.value = value;
};

// 初始化操作
(async () => {
    data.value = await props.api.list({ searchData: {}, page: 1, pageSize: 10 });
})();
</script>
<script lang="ts">
/**
 * 获取数据列表参数
 */
type ListApiParams<T> = {
    /** 查询数据 */
    searchData: SearchData<keyof T>;
    /** 页码 */
    page: number;
    /** 每页最大数据条数 */
    pageSize: number;
};

/**
 * 表组件参数
 */
export type MoGridProps<T = any> = {
    /** 表格配置 */
    table: Omit<MoTableProps<T>, 'data'>;
    /** 工具栏配置 */
    toolbar?: MoToolbarProps;
    /** 查询栏配置 */
    search?: MoSearchProps<keyof T>;
    /** 分页配置 */
    pagination?: {
        /** 每页最大数据条数 */
        pageSize?: number;
    };
    /** 接口 */
    api: {
        /** 获取数据列表 */
        list: (params: ListApiParams<T>) => T[] | Promise<T[]>;
        /** 添加数据 */
        add: (data: T) => Promise<boolean> | boolean;
        /** 删除数据 */
        remove: (data: T) => Promise<boolean> | boolean;
        /** 批量删除数据 */
        removeBatch: (datas: T[]) => Promise<boolean> | boolean;
        /** 更新数据 */
        update: (data: T) => Promise<boolean> | boolean;
    };
};
</script>

<template>
    <el-container class="h-full">
        <el-header class="h-auto" v-if="props.search">
            <mo-search v-bind="props.search" @search="searchEvent" />
            <el-divider class="m0" />
        </el-header>
        <el-container>
            <el-header v-if="props.toolbar" class="h-auto pt-3">
                <mo-toolbar v-bind="props.toolbar" @add="addEvent" @delete-batch="deleteBatchEvent" />
            </el-header>
            <el-main class="pt-3">
                <mo-table ref="moTableRef" v-bind="props.table" :data="data" @edit="editEvent" @delete="deleteEvent" />
            </el-main>
            <el-footer>
                <mo-pagination
                    :page="page"
                    :page-size="props.pagination?.pageSize"
                    :total="total"
                    @change="pageChangeEvent"
                />
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped></style>
