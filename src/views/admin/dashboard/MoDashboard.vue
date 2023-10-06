<script setup lang="ts">
import MoNavbar from './compoents/MoNavbar.vue';
import MoSidebar from './compoents/MoSidebar.vue';
import ContextMenu from '@imengyu/vue3-context-menu';
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
    /** 销毁回调 */
    onDestory?: () => void;
};

/** 菜单是否折叠 */
const isCollapse = ref(false);
/** 当前活动标签值 */
const currentTabValue = ref('');
/** 标签数组 */
const tabs = reactive<TabItem[]>([]);

/** 标签栏元素对象 */
const tabbarRef = ref();
/** 当前右键标签值 */
const tabbarValue = ref('');

/**
 * 显示标签右键菜单
 *
 * @param e 鼠标事件对象
 * @param hiddens 隐藏的菜单项索引数组
 */
function showTabMenu(e: MouseEvent, hiddens?: number[]) {
    const items = [
        {
            label: '关闭当前',
            onClick: () => removeTab(tabbarValue.value)
        },
        {
            label: '关闭左侧',
            onClick: () => {
                currentTabValue.value = tabbarValue.value;
                const index = tabs.findIndex((tab) => tab._id === tabbarValue.value);
                for (let i = 1; i < index; i++) {
                    tabs[i].onDestory?.();
                }
                tabs.splice(1, index - 1);
            }
        },
        {
            label: '关闭右侧',
            onClick: () => {
                currentTabValue.value = tabbarValue.value;
                const index = tabs.findIndex((tab) => tab._id === tabbarValue.value);
                for (let i = tabs.length - 1; i > index; i--) {
                    tabs[i].onDestory?.();
                }
                tabs.splice(index + 1);
            }
        },
        {
            label: '关闭其他',
            onClick: () => {
                currentTabValue.value = tabbarValue.value;
                const index = tabs.findIndex((tab) => tab._id === tabbarValue.value);
                for (let i = 1; i < tabs.length; i++) {
                    i !== index && tabs[i].onDestory?.();
                }
                if (index === 0) {
                    tabs.splice(1, tabs.length - 1);
                } else {
                    tabs.splice(index + 1);
                    tabs.splice(1, index - 1);
                }
            }
        },
        {
            label: '关闭全部',
            onClick: () => {
                currentTabValue.value = tabs[0]._id;
                for (let i = 1; i < tabs.length; i++) {
                    tabs[i].onDestory?.();
                }
                tabs.splice(1, tabs.length - 1);
            }
        }
    ];
    ContextMenu.showContextMenu({
        theme: 'flat',
        x: e.x + 8,
        y: e.y + 14,
        preserveIconWidth: false,
        items: hiddens ? items.filter((_, index) => !hiddens.includes(index)) : items
    });
}

/**
 * 打开标签页
 *
 * @param _id ID
 * @param title 标题
 * @param params 参数
 */
function openTab(_id: string, title?: string, params?: any) {
    for (const tab of tabs) {
        if (tab._id === _id) {
            currentTabValue.value = _id;
            return;
        }
    }
    const menuData = getMenuItem(_id);
    if (!menuData || !('component' in menuData)) {
        openNotFoundTab(_id, title);
        return;
    }
    let componentLike = menuData.component();
    if (componentLike instanceof Promise) {
        componentLike = componentLike.then((module) => module.default);
    }
    Promise.resolve(componentLike).then((component) => {
        const tab: TabItem = {
            _id,
            title: title || menuData.title,
            params,
            component: markRaw(component)
        };
        tabs.push(tab);
        currentTabValue.value = _id;

        // 设置监听标签右键菜单
        nextTick(() => {
            const element: HTMLElement = tabbarRef.value[tabs.length - 1];
            const tabbar = element.parentElement as HTMLElement;
            const onContextmenu = function (e: MouseEvent) {
                e.preventDefault();
                tabbarValue.value = _id;
                if (tabs.length > 1) {
                    if (tabs[0]._id === _id) {
                        showTabMenu(e, [0, 1, 4]);
                    } else if (tabs[tabs.length - 1]._id === _id) {
                        if (tabs[1]._id === _id) {
                            showTabMenu(e, [1, 2, 3, 4]);
                        } else {
                            showTabMenu(e, [2]);
                        }
                    } else {
                        showTabMenu(e);
                    }
                }
            };
            tabbar.addEventListener('contextmenu', onContextmenu);
            tab.onDestory = () => tabbar.removeEventListener('contextmenu', onContextmenu);
        });
    });
}

/**
 * 删除标签页
 *
 * @param _id 标签页标识ID
 */
function removeTab(_id: string | number) {
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
    tabs[removeIndex].onDestory?.();
    tabs.splice(removeIndex, 1);
}

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
                <el-tabs
                    class="mo-dashboard__tabs"
                    v-model="currentTabValue"
                    type="border-card"
                    closable
                    @tab-remove="removeTab"
                >
                    <el-tab-pane v-for="item in tabs" :key="item._id" :name="item._id">
                        <template #label>
                            <span ref="tabbarRef">{{ item.title }}</span>
                        </template>
                        <el-scrollbar class="mo-dashboard__scrollbar">
                            <component :is="item.component" :params="item.params" />
                        </el-scrollbar>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.mo-dashboard__tabs.el-tabs {
    display: flex;
    flex-flow: column;
    height: 100%;
    border-radius: 0.5rem;
}

.mo-dashboard__tabs.el-tabs :deep(.el-tabs__content) {
    flex: 1;
    padding: 0;
}

.mo-dashboard__tabs.el-tabs :deep(.el-tabs__content .el-tab-pane) {
    position: absolute;
    width: 100%;
    height: 100%;
}

.mo-dashboard__tabs.el-tabs .mo-dashboard__scrollbar.el-scrollbar {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0.5rem;
}

.mo-dashboard__tabs.el-tabs .mo-dashboard__scrollbar.el-scrollbar :deep(.el-scrollbar__view) {
    height: 100%;
}

.mo-dashboard__tabs.el-tabs :deep(.el-tabs__header .el-tabs__nav .el-tabs__item:first-child i) {
    display: none;
}
</style>
