import type { RouteComponent, RouteLocationNormalized } from 'vue-router';
import { FunctionalComponent } from 'vue';

declare global {
    // 路由meta的类型定义
    interface CustomRouteMeta {
        title: string; // 菜单名称
        icon?: string | FunctionalComponent; // 菜单图标
        sort?: number; // 菜单排序，值越大，菜单越靠后
        showLink?: boolean; // 是否在菜单列表显示，默认true
        roles?: Array<string>; // 页面级别权限
        auth?: Array<string>; // 按钮级别权限
        keepAlive?: boolean; // 该菜单的页面是否要缓存
        hiddenTag?: boolean; // 当前菜单是否要添加至标签页，默认为false
        fixedTag?: boolean; // 当前菜单是否需要固定至标签页且不可被关闭，默认为false
        dynamicTitle?: boolean; // 是否支持动态标题（用于详情页等）
        titleTemplate?: string; // 动态标题模板，如 "用户详情-{id}"
    }

    interface RouteConfig {
        path: string; // 路由路径
        name?: string; // 路由name，唯一
        component?: RouteComponent | (() => Promise<unknown>); // 路由对应的组件
        redirect?: string; // 路由重定向
        meta?: CustomRouteMeta; // 路由元数据
        children?: Array<RouteConfig>; // 子路由
    }

    // 标签页专用的数据结构
    interface TabItem extends RouteConfig {
        tabKey?: string; // 标签页唯一标识（包含参数信息）
        fullPath?: string; // 完整路径（包含参数和查询）
        params?: Record<string, any>; // 路由参数
        query?: Record<string, any>; // 查询参数
    }
}

declare module 'vue-router' {
    // 扩展vue-router的路由元数据
    interface RouteMeta extends CustomRouteMeta {}
}

// 标签页相关的命名空间
declare namespace TabsMenu {
    interface list {
        list: Array<menu>;
    }

    interface menu {
        type: number;
        icon: string;
        title: string;
    }
}
