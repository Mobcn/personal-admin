<script setup lang="ts" generic="T extends Record<string, any>">
import type { MoSearchProps, SearchData } from './components/MoSearch.vue';
import type { MoToolbarProps } from './components/MoToolbar.vue';
import type { MoTableProps, MoTableInstance } from './components/MoTable.vue';
import { ElMessageBox } from 'element-plus';
import type { EditData, MoEditDialogConfig, MoEditDialogParams } from './components/MoEditDialog.vue';

/** 参数 */
const props = defineProps<MoGridProps<T>>();

/** 表格元素对象 */
const moTableRef = ref<MoTableInstance<T>>();

/** 表格数据 */
const tableData = ref([]) as Ref<T[]>;

/** 编辑弹窗是否显示 */
const editDialogVisible = ref(false);
/** 编辑弹窗数据参数 */
const editDialogParams = ref({}) as Ref<MoEditDialogParams<T>>;

/** 当前页码 */
const page = ref(1);
/** 每页最大数据条数 */
const pageSize = ref(props.pagination?.pageSize ?? 10);
/** 总数据条数 */
const tableTotal = ref(0);

/** 查询事件 */
const searchEvent = async (searchData: SearchData<T>) => {
    page.value = 1;
    loadData(searchData);
};
/** 添加事件 */
const addEvent = () => openEditDialog();
/** 删除事件 */
const deleteEvent = (row: T) => {
    ElMessageBox.confirm(`确定要删除吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            await props.api.remove(row);
            loadData();
        })
        .catch(() => 'cancel');
};
/** 批量删除事件 */
const deleteBatchEvent = async () => {
    ElMessageBox.confirm(`确定要批量删除选择项吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            const $table = moTableRef.value;
            if ($table) {
                const rows = $table.getSelectionRows();
                await props.api.removeBatch(rows);
                loadData();
            }
        })
        .catch(() => 'cancel');
};
/** 编辑事件 */
const editEvent = (row: T) => openEditDialog({ ...row });
/** 页码修改事件 */
const pageChangeEvent = (value: number) => {
    page.value = value;
    loadData();
};
/** 编辑弹窗确认事件 */
const confirmEvent = async (type: 'add' | 'update', editData: EditData<T>) => {
    if (type === 'add') {
        await props.api.add(editData);
        page.value = 1;
        loadData();
    } else {
        await props.api.update(editData);
        loadData();
    }
    editDialogVisible.value = false;
};

/**
 * 加载数据
 *
 * @param searchData 查询数据
 */
async function loadData(searchData?: SearchData<T>) {
    const { data, total } = await props.api.list({
        searchData: searchData ?? {},
        page: page.value,
        pageSize: pageSize.value
    });
    tableData.value = data;
    tableTotal.value = total;
}

/**
 * 打开编辑弹窗
 */
function openEditDialog(data?: T) {
    editDialogParams.value = { data };
    editDialogVisible.value = true;
}

// 初始化操作
(async () => {
    loadData();
})();
</script>
<script lang="ts">
/**
 * 获取数据列表参数
 */
type ListApiParams<T> = {
    /** 查询数据 */
    searchData: SearchData<T>;
    /** 页码 */
    page: number;
    /** 每页最大数据条数 */
    pageSize: number;
};

/**
 * 表组件参数
 */
export type MoGridProps<T extends Record<string, any>> = {
    /** 表格配置 */
    table: Omit<MoTableProps<T>, 'data'>;
    /** 工具栏配置 */
    toolbar?: MoToolbarProps;
    /** 查询栏配置 */
    search?: MoSearchProps<T>;
    /** 分页配置 */
    pagination?: {
        /** 每页最大数据条数 */
        pageSize?: number;
    };
    /** 编辑弹窗配置 */
    editDialog?: MoEditDialogConfig<T>;
    /** 接口 */
    api: {
        /** 获取数据列表 */
        list: (params: ListApiParams<T>) => { data: T[]; total: number } | Promise<{ data: T[]; total: number }>;
        /** 添加数据 */
        add: (data: EditData<T>) => Promise<void> | void;
        /** 删除数据 */
        remove: (data: T) => Promise<void> | void;
        /** 批量删除数据 */
        removeBatch: (datas: T[]) => Promise<void> | void;
        /** 更新数据 */
        update: (data: EditData<T>) => Promise<void> | void;
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
                <mo-table
                    ref="moTableRef"
                    v-bind="props.table"
                    :data="tableData"
                    @edit="editEvent"
                    @delete="deleteEvent"
                />
            </el-main>
            <el-footer>
                <mo-pagination :page="page" :page-size="pageSize" :total="tableTotal" @change="pageChangeEvent" />
            </el-footer>
        </el-container>
        <mo-edit-dialog
            v-if="props.editDialog"
            v-model="editDialogVisible"
            :config="props.editDialog"
            :params="editDialogParams"
            @cancel="() => (editDialogVisible = false)"
            @confirm="confirmEvent"
        />
    </el-container>
</template>

<style scoped></style>
