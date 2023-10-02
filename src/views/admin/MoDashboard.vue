<script setup lang="ts">
import MoNavbar from './MoNavbar.vue';
import MoSidebar from './MoSidebar.vue';

/** 菜单是否折叠 */
const isCollapse = ref(false);
</script>

<template>
    <el-container class="h-screen">
        <el-aside class="transition-300 transition-property-width" :width="isCollapse ? '64px' : '210px'">
            <el-scrollbar><MoSidebar :collapse="isCollapse" /></el-scrollbar>
        </el-aside>
        <el-divider class="h-full m0" direction="vertical" />
        <el-container>
            <el-header class="p0" height="50px">
                <MoNavbar :switch="isCollapse" @switch-click="(state) => (isCollapse = state)" />
            </el-header>
            <el-divider class="m0" />
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>
