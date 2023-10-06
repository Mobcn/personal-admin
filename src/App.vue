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
</style>
