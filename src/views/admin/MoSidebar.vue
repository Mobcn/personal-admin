<script setup lang="ts">
/** 参数 */
const props = defineProps<{
    /** 菜单是否折叠 */
    collapse: boolean;
}>();
</script>

<template>
    <el-menu class="border-none" default-active="1" :collapse="props.collapse" :collapse-transition="false">
        <el-tooltip :disabled="!props.collapse" effect="dark" content="Navigator One" placement="right">
            <el-menu-item index="1">
                <el-icon><mo-icon icon-name="speedometer"></mo-icon></el-icon>
                <span>Navigator One</span>
            </el-menu-item>
        </el-tooltip>
        <el-sub-menu index="2">
            <template #title>
                <el-icon><mo-icon icon-name="speedometer"></mo-icon></el-icon>
                <span>Navigator Two</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="3">
            <el-icon><mo-icon icon-name="speedometer"></mo-icon></el-icon>
            <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon><mo-icon icon-name="speedometer"></mo-icon></el-icon>
            <span>Navigator Four</span>
        </el-menu-item>
    </el-menu>
</template>

<style scoped>
.el-menu {
    --el-menu-bg-color: transparent;
}
</style>
