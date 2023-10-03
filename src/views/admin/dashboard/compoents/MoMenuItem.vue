<script setup lang="ts">
import type { MenuData } from '@/utils/menu';

/** 参数 */
const props = defineProps<{
    /** 菜单数据列表 */
    menuDataList: MenuData[];
    /** 菜单是否折叠 */
    collapse?: boolean;
}>();
</script>

<template>
    <template v-for="menuItem in props.menuDataList" :key="menuItem._id">
        <el-sub-menu v-if="'subMenu' in menuItem" :index="menuItem._id!">
            <template #title>
                <el-icon v-if="menuItem.icon"><mo-icon :icon-name="menuItem.icon"></mo-icon></el-icon>
                <span>{{ menuItem.title }}</span>
            </template>
            <MoMenuItem :menu-data-list="menuItem.subMenu" />
        </el-sub-menu>
        <el-tooltip v-else :disabled="!props.collapse" effect="dark" :content="menuItem.title" placement="right">
            <el-menu-item :index="menuItem._id!">
                <el-icon v-if="menuItem.icon"><mo-icon :icon-name="menuItem.icon"></mo-icon></el-icon>
                <span>{{ menuItem.title }}</span>
            </el-menu-item>
        </el-tooltip>
    </template>
</template>
