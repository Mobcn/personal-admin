<script setup lang="ts">
import { markRaw, ref } from 'vue';
import type { Component } from 'vue';

// 当前子组件
const currentComponent = ref<Component | null>(null);

// 初始化操作
(async () => {
    try {
        currentComponent.value = markRaw((await import('@/views/admin/Main.vue')).default);
    } catch (error) {
        console.log(error);
        currentComponent.value = markRaw((await import('@/views/common/404.vue')).default);
    }
})();
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
