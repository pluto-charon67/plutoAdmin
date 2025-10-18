import type { RouteLocationNormalized } from 'vue-router';

/**
 * 生成标签页唯一键
 * @param route 路由对象
 * @returns 唯一键字符串
 */
export function generateTabKey(route: RouteLocationNormalized): string {
    const { name, params, query } = route;
    
    // 基础键值
    let key = String(name || route.path);
    
    // 添加路由参数
    if (params && Object.keys(params).length > 0) {
        const paramStr = Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b)) // 排序确保一致性
            .map(([k, v]) => `${k}=${v}`)
            .join('&');
        key += `_params_${paramStr}`;
    }
    
    // 添加查询参数（可选，根据业务需求）
    if (query && Object.keys(query).length > 0) {
        const queryStr = Object.entries(query)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join('&');
        key += `_query_${queryStr}`;
    }
    
    return key;
}

/**
 * 生成动态标题
 * @param route 路由对象
 * @returns 标题字符串
 */
export function generateDynamicTitle(route: RouteLocationNormalized): string {
    const { meta, params } = route;
    
    if (!meta?.dynamicTitle || !meta?.titleTemplate) {
        return meta?.title || '未命名页面';
    }
    
    let title = meta.titleTemplate;
    
    // 替换模板中的参数占位符
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        });
    }
    
    return title;
}

/**
 * 将路由转换为标签页数据
 * @param route 路由对象
 * @returns 标签页数据
 */
export function routeToTabItem(route: RouteLocationNormalized): TabItem {
    const tabKey = generateTabKey(route);
    const dynamicTitle = generateDynamicTitle(route);
    
    return {
        path: route.path,
        name: route.name,
        fullPath: route.fullPath,
        params: route.params,
        query: route.query,
        tabKey,
        meta: {
            ...route.meta,
            title: dynamicTitle, // 使用动态标题
        },
    };
}

/**
 * 检查是否为详情页类型的路由
 * @param route 路由对象
 * @returns 是否为详情页
 */
export function isDetailRoute(route: RouteLocationNormalized): boolean {
    // 检查路由参数中是否包含 id
    return !!(route.params && route.params.id);
}

/**
 * 获取标签页显示标题
 * @param tabItem 标签页数据
 * @returns 显示标题
 */
export function getTabDisplayTitle(tabItem: TabItem): string {
    if (tabItem.meta?.dynamicTitle && tabItem.params?.id) {
        const baseTitle = tabItem.meta.title || '详情';
        const id = tabItem.params.id;
        return `${baseTitle}(${id})`;
    }
    
    return tabItem.meta?.title || '未命名';
}
