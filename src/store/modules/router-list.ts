import { defineStore } from 'pinia';
import { TabsMenu } from '@/types/router';

export const useTagsSTore = defineStore('router-list', {
    state: () => ({
        tabsList: [] as Array<RouteConfig>, // 标签页数据
    }),
    getters: {},
    actions: {
        /**
         * 添加标签页
         * @param data 当前路由
         */
        addTabsList(data: RouteConfig) {
            // 当前路由是否存在于标签页，不存在就添加
            const isExist = this.tabsList.some((item: RouteConfig) => item.name === data.name);
            if (isExist) return;
            this.tabsList.push({ ...data });
        },
        /**
         * 删除标签页的指定路由
         * @param name 路由name
         */
        removeTabsList(name: string) {
            const index = this.tabsList.findIndex((item: RouteConfig) => item.name === name);
            if (index === -1) return;
            this.tabsList.splice(index, 1);
        },
    },
});
