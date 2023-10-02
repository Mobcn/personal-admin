<script setup lang="ts">
import MoNavbar from './MoNavbar.vue';
import MoSidebar from './MoSidebar.vue';
import { getMenuItem } from '@/config/mo-sidebar';

/**
 * 标签项
 */
type TabItem = {
    /** ID */
    _id: string;
    /** 标题 */
    title: string;
    /** 参数 */
    params?: any;
    /** 组件 */
    component: Component;
};

/** 菜单是否折叠 */
const isCollapse = ref(false);
/** 当前活动标签值 */
const currentTabValue = ref('');
/** 标签数组 */
const tabs = reactive<TabItem[]>([]);

/**
 * 打开标签页
 */
const openTab = (() => {
    // @ts-ignore
    const components: { [path: string]: () => Promise<{ default: Component }> } = import.meta.glob('/src/**/*.vue');

    /**
     * @param _id ID
     * @param title 标题
     * @param params 参数
     */
    return (_id: string, title?: string, params?: any) => {
        for (const tab of tabs) {
            if (tab._id === _id) {
                currentTabValue.value = _id;
                return;
            }
        }
        const menuData = getMenuItem(_id);
        if (menuData && 'component' in menuData) {
            components[menuData.component]().then((module) => {
                tabs.push({
                    _id,
                    title: title || menuData.title,
                    params,
                    component: markRaw(module.default)
                });
                currentTabValue.value = _id;
            });
            return;
        }
        openNotFoundTab(_id, title);
    };
})();

/**
 * 删除标签页
 *
 * @param _id 标签页标识ID
 */
const removeTab = (_id: string | number) => {
    let active = currentTabValue.value;
    if (active === _id) {
        tabs.forEach((tab, index) => {
            if (tab._id === _id) {
                const nextTab = tabs[index + 1] ?? tabs[index - 1];
                if (nextTab) {
                    active = nextTab._id;
                }
            }
        });
    }
    currentTabValue.value = active;
    const removeIndex = tabs.findIndex((tab) => tab._id === _id);
    tabs.splice(removeIndex, 1);
};

/**
 * 打开404标签页
 *
 * @param _id 标签ID
 * @param title 标题
 */
function openNotFoundTab(_id: string, title?: string) {
    import('@/views/common/404.vue').then((module) => {
        tabs.push({
            _id,
            title: title || '无标题',
            component: markRaw(module.default)
        });
        currentTabValue.value = _id;
    });
}

// 提供打开标签页的方法
provide('openTab', openTab);
</script>
<script lang="ts">
/**
 * 打开标签页
 */
export type OpenTabFunction = (_id: string, title?: string) => void;
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
            <el-main class="p0 overflow-hidden">
                <el-tabs v-model="currentTabValue" type="border-card" closable @tab-remove="removeTab">
                    <el-tab-pane v-for="item in tabs" :key="item._id" :label="item.title" :name="item._id">
                        <el-scrollbar>
                            <component :is="item.component" :params="item.params" />
                        </el-scrollbar>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-tabs {
    display: flex;
    flex-flow: column;
    height: 100%;
    border-radius: 0.5rem;
}

.el-tabs >>> .el-tabs__content {
    flex: 1;
    padding: 0;
}

.el-tabs >>> .el-tabs__content .el-tab-pane {
    position: absolute;
    width: 100%;
    height: 100%;
}

.el-tabs .el-scrollbar {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0.5rem;
}

.el-tabs .el-scrollbar >>> .el-scrollbar__view {
    height: 100%;
}

.el-tabs >>> .el-tabs__header .el-tabs__nav .el-tabs__item:first-child i {
    display: none;
}
</style>
