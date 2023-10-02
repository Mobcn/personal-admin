/**
 * 菜单数据
 */
type MenuData = {
    /** 菜单项ID */
    _id?: string;
    /** 菜单项标题 */
    title: string;
    /** 菜单项图标 */
    icon?: string;
} & (
    | {
          /** 子菜单项 */
          subMenu: MenuData[];
      }
    | {
          /** 菜单项路由 */
          path: string;
          /** 菜单项组件 */
          component: string;
      }
);

/**
 * 菜单配置解析结果
 */
type ResolveMenuResult = {
    /** 菜单数据列表 */
    menuDataList: MenuData[];
    /** 叶节点菜单数据列表 */
    leafMenuDataList: MenuData[];
    /** 路由映射集 */
    routeMap: Map<string, [string, string]>;
    /** 通过菜单项ID获取菜单项 */
    getMenuItem: (id: string, thisArg?: MenuData[]) => MenuData | null;
};

/**
 * 展开数组
 *
 * @param src 源数组
 * @param des 展开数组
 * @param unfoldFun 数组展开映射函数
 * @param depth 深度
 */
function unfold<T>(src: T[], des: T[], unfoldFun: (array: T) => T[] | [T], depth: number) {
    if (depth <= 0) {
        des.push(...src);
        return;
    }
    for (const item of src) {
        const res = unfoldFun(item);
        if (res.length > 1) {
            unfold(res, des, unfoldFun, depth - 1);
        } else {
            des.push(res[0]);
        }
    }
}

/**
 * 平铺数组
 *
 * @param target 目标数组
 * @param unfoldFun 数组展开映射函数
 * @param depth 深度
 */
function flatMap<T>(target: T[], unfoldFun: (array: T) => T[] | [T], depth = 1) {
    const flatArray: T[] = [];
    unfold(target, flatArray, unfoldFun, depth);
    return flatArray;
}

/**
 * 生成菜单项ID
 *
 * @param menuDataList 菜单数据列表
 * @param preffix 菜单配置数据
 */
function generateMenuID(menuDataList: MenuData[], preffix = '') {
    let index = 0;
    for (const item of menuDataList) {
        item._id = (preffix && preffix + '_') + index++;
        if ('subMenu' in item) {
            generateMenuID(item.subMenu, item._id);
        }
    }
}

/**
 * 解析菜单配置
 *
 * @param config 菜单配置数据
 * @return 菜单配置解析结果
 */
export function resolveMenu(config: MenuData[]): ResolveMenuResult {
    /** 菜单数据列表 */
    const menuDataList: MenuData[] = JSON.parse(JSON.stringify(config));
    generateMenuID(menuDataList);

    /** 叶节点菜单数据列表 */
    const leafMenuDataList = flatMap(menuDataList, (item) => ('subMenu' in item ? item.subMenu : [item]), Infinity);

    /** 路由映射集 */
    const routeMap: Map<string, [string, string]> = new Map();
    leafMenuDataList.forEach((item) => 'path' in item && routeMap.set(item.path, [item._id!, item.component]));

    /**
     * 通过菜单项ID获取菜单项
     *
     * @param id 菜单项ID
     * @param list 菜单数据列表
     */
    function getMenuItem(id: string, list = menuDataList) {
        const indexs = id.split('_').map((item) => Number(item));
        let menuItem = list[indexs[0]];
        for (let i = 1; i < indexs.length; ++i) {
            if (!('subMenu' in menuItem)) {
                return null;
            }
            menuItem = menuItem.subMenu[indexs[i]];
        }
        return menuItem;
    }

    return { menuDataList, leafMenuDataList, routeMap, getMenuItem };
}

export type { MenuData };
