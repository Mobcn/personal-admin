import { resolveMenu } from '@/utils/menu';
import type { MenuData } from '@/utils/menu';

/**
 * 侧边栏配置
 */
const menuData: MenuData[] = [
    {
        title: '首页',
        icon: 'speedometer',
        path: '/',
        component: () => import('@/views/admin/home/MoHome.vue')
    },
    {
        title: '发布文章',
        icon: 'lightbulb-fill',
        path: '/publish',
        component: () => import('@/views/admin/publish/ArticleEdit.vue')
    },
    {
        title: '内容管理',
        icon: 'box-fill',
        subMenu: [
            {
                title: '分类管理',
                icon: 'grid',
                path: '/management/category',
                component: () => import('@/views/admin/management/category/MoCategory.vue')
            },
            {
                title: '标签管理',
                icon: 'tags',
                path: '/management/tag',
                component: () => import('@/views/admin/management/tag/MoTag.vue')
            }
        ]
    }
];

const { menuDataList, leafMenuDataList, routeMap, getMenuItem } = resolveMenu(menuData);
export { menuDataList, leafMenuDataList, routeMap, getMenuItem };
