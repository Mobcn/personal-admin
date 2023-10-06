<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import type { ProvideChangePage } from '@/App.vue';

/** 参数 */
const props = defineProps<{
    /** 开关状态 */
    switch: boolean;
}>();

/** 回调 */
const emits = defineEmits<{
    /** 开关点击 */
    switchClick: [state: boolean];
}>();

/** 页面修改 */
const changePage = inject<ProvideChangePage>('changePage', () => {
    throw new Error('找不到changePage方法');
});

/**
 * 退出登录
 */
function exit() {
    ElMessageBox.confirm('确定要退出吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            storage.remove('token');
            changePage(import('@/views/common/Login.vue'));
        })
        .catch(() => 'cancel');
}
</script>

<template>
    <div class="w-full h-full flex items-center justify-between">
        <mo-icon
            class="p-3.75 hover:bg-mask-1 hover:cursor-pointer"
            :icon-name="props.switch ? 'text-indent-left' : 'text-indent-right'"
            width="20px"
            height="20px"
            @click="emits('switchClick', !props.switch)"
        ></mo-icon>
        <mo-icon
            class="p-3.75 hover:bg-mask-1 hover:cursor-pointer"
            icon-name="box-arrow-right"
            width="20px"
            height="20px"
            @click="exit"
        ></mo-icon>
    </div>
</template>

<style scoped></style>
