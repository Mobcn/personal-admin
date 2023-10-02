<script setup lang="ts">
import MoMenuItem from './MoMenuItem.vue';
import { menuDataList, leafMenuDataList } from '@/config/mo-sidebar';

/** 参数 */
const props = defineProps<{
    /** 菜单是否折叠 */
    collapse: boolean;
}>();
</script>

<template>
    <el-menu
        class="border-none"
        :default-active="leafMenuDataList[0]?._id"
        :collapse="props.collapse"
        :collapse-transition="false"
    >
        <MoMenuItem :menu-data-list="menuDataList" :collapse="props.collapse" />
    </el-menu>
</template>

<style scoped>
.el-menu {
    --el-menu-bg-color: transparent;
}
</style>
