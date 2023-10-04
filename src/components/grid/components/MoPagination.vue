<script setup lang="ts">
/** 参数 */
const props = defineProps<MoPapaginationProps>();

/** 回调 */
const emits = defineEmits<{
    /** 页码修改事件 */
    change: [page: number];
    /** 每页最大数据条数修改事件 */
    sizeChange: [pageSize: number];
}>();
</script>
<script lang="ts">
/**
 * 分页参数
 */
export type MoPapaginationProps = {
    /** 当前页码 */
    page: number;
    /** 每页最大数据条数 */
    pageSize: number;
    /** 总数据条数 */
    total: number;
};
</script>

<template>
    <el-pagination
        class="pb-2.5"
        layout="prev, pager, next, jumper, sizes, total"
        :current-page="props.page"
        :page-size="props.pageSize"
        :total="props.total"
        @current-change="(page) => emits('change', page)"
        @size-change="(pageSize) => emits('sizeChange', pageSize)"
    />
</template>
