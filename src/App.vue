<script setup lang="ts">
/** 当前子组件 */
const currentComponent = ref<Component | null>(null);

/**
 * 页面修改
 *
 * @param page 页面组件
 * @param params 页面组件参数
 */
async function changePage(page: Promise<{ default: Component }> | Component) {
    if (page instanceof Promise) {
        currentComponent.value = markRaw((await page).default);
    } else {
        currentComponent.value = page;
    }
}

// 提供页面修改的方法
provide('changePage', changePage);

// 初始化操作
(async () => {
    try {
        if (storage.get('token')) {
            changePage(import('@/views/admin/dashboard/MoDashboard.vue'));
        } else {
            changePage(import('@/views/common/Login.vue'));
        }
    } catch (error) {
        process.env.VUE_APP_ENV !== 'production' && console.error(error);
        changePage(import('@/views/common/404.vue'));
    }
})();
</script>
<script lang="ts">
/**
 * 页面修改
 */
export type ProvideChangePage = (page: Promise<{ default: Component }> | Component) => void;
</script>

<template>
    <component :is="currentComponent" />
</template>

<style>
/* 修改全局滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-thumb {
    transition: all 0.2s ease-in-out;
    border-radius: 10px;
    background-color: #0003;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
}

/* 黑暗主题按钮配置 */
html.dark .el-button {
    --el-button-active-text-color: var(--el-color-white);
}
html.dark .el-button--primary {
    --el-button-bg-color: var(--el-color-primary-light-9);
    --el-button-border-color: var(--el-color-primary-light-5);
    --el-button-hover-bg-color: var(--el-color-primary);
    --el-button-hover-border-color: var(--el-color-primary);
}
html.dark .el-button--success {
    --el-button-bg-color: var(--el-color-success-light-9);
    --el-button-border-color: var(--el-color-success-light-5);
    --el-button-hover-bg-color: var(--el-color-success);
    --el-button-hover-border-color: var(--el-color-success);
}
html.dark .el-button--info {
    --el-button-bg-color: var(--el-color-info-light-9);
    --el-button-border-color: var(--el-color-info-light-5);
    --el-button-hover-bg-color: var(--el-color-info);
    --el-button-hover-border-color: var(--el-color-info);
}
html.dark .el-button--warning {
    --el-button-bg-color: var(--el-color-warning-light-9);
    --el-button-border-color: var(--el-color-warning-light-5);
    --el-button-hover-bg-color: var(--el-color-warning);
    --el-button-hover-border-color: var(--el-color-warning);
}
html.dark .el-button--danger {
    --el-button-bg-color: var(--el-color-danger-light-9);
    --el-button-border-color: var(--el-color-danger-light-5);
    --el-button-hover-bg-color: var(--el-color-danger);
    --el-button-hover-border-color: var(--el-color-danger);
}
</style>
