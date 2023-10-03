<script setup lang="ts">
import MoMenuItem from './MoMenuItem.vue';
import { menuDataList, leafMenuDataList } from '@/config/mo-sidebar';
import type { OpenTabFunction } from '../MoDashboard.vue';

/** 参数 */
const props = defineProps<{
    /** 菜单是否折叠 */
    collapse: boolean;
}>();

/** 打开标签页 */
const openTab = inject<OpenTabFunction>('openTab')!;

// 初始化操作
(() => {
    // 默认打开第一个菜单
    leafMenuDataList[0]?._id && openTab(leafMenuDataList[0]._id);
})();
</script>

<template>
    <el-menu
        class="border-none"
        :default-active="leafMenuDataList[0]?._id"
        :collapse="props.collapse"
        :collapse-transition="false"
        @select="(index) => openTab(index)"
    >
        <MoMenuItem :menu-data-list="menuDataList" :collapse="props.collapse" />
    </el-menu>
</template>

<style scoped>
.el-menu {
    --el-menu-bg-color: transparent;
}
</style>
