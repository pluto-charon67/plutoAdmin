import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { TabsMenu } from '@/types/router';
import { routeToTabItem, generateTabKey } from '@/utils/tabUtils';

export const useTagsStore = defineStore('router-list', {
    state: () => ({
        tabsList: [] as Array<TabItem>, // 标签页数据
        activeTabKey: '', // 当前激活的标签页
    }),
    getters: {
        /**
         * 获取当前激活的标签页
         */
        activeTab: (state) => {
            return state.tabsList.find(tab => tab.tabKey === state.activeTabKey);
        },
        /**
         * 获取可关闭的标签页列表
         */
        closableTabs: (state) => {
            return state.tabsList.filter(tab => !tab.meta?.fixedTag);
        },
    },
    actions: {
        /**
         * 添加标签页
         * @param route 当前路由
         */
        addTabsList(route: RouteLocationNormalized) {
            // 检查是否隐藏标签页
            if (route.meta?.hiddenTag) return;
            
            const tabItem = routeToTabItem(route);
            const tabKey = tabItem.tabKey!;
            
            // 检查是否已存在（基于 tabKey 而不是 name）
            const existIndex = this.tabsList.findIndex(item => item.tabKey === tabKey);
            
            if (existIndex !== -1) {
                // 如果已存在，更新标签页信息（可能标题等有变化）
                this.tabsList[existIndex] = { ...this.tabsList[existIndex], ...tabItem };
            } else {
                // 不存在则添加新标签页
                this.tabsList.push(tabItem);
            }
            
            // 设置为当前激活标签页
            this.activeTabKey = tabKey;
        },
        
        /**
         * 删除标签页
         * @param tabKey 标签页唯一键
         */
        removeTabsList(tabKey: string) {
            const index = this.tabsList.findIndex(item => item.tabKey === tabKey);
            if (index === -1) return;
            
            const removedTab = this.tabsList[index];
            
            // 检查是否为固定标签页
            if (removedTab.meta?.fixedTag) {
                console.warn('固定标签页不能被关闭');
                return;
            }
            
            this.tabsList.splice(index, 1);
            
            // 如果删除的是当前激活标签页，需要切换到其他标签页
            if (this.activeTabKey === tabKey && this.tabsList.length > 0) {
                // 优先选择右侧标签页，如果没有则选择左侧
                const newActiveIndex = index < this.tabsList.length ? index : index - 1;
                this.activeTabKey = this.tabsList[newActiveIndex]?.tabKey || '';
            }
        },
        
        /**
         * 删除其他标签页
         * @param keepTabKey 保留的标签页键
         */
        removeOtherTabs(keepTabKey: string) {
            this.tabsList = this.tabsList.filter(tab => 
                tab.tabKey === keepTabKey || tab.meta?.fixedTag
            );
            this.activeTabKey = keepTabKey;
        },
        
        /**
         * 删除所有标签页
         */
        removeAllTabs() {
            // 只保留固定标签页
            this.tabsList = this.tabsList.filter(tab => tab.meta?.fixedTag);
            this.activeTabKey = this.tabsList[0]?.tabKey || '';
        },
        
        /**
         * 删除左侧标签页
         * @param tabKey 基准标签页键
         */
        removeLeftTabs(tabKey: string) {
            const index = this.tabsList.findIndex(item => item.tabKey === tabKey);
            if (index === -1) return;
            
            // 保留固定标签页和指定标签页右侧的标签页
            this.tabsList = this.tabsList.filter((tab, i) => 
                i >= index || tab.meta?.fixedTag
            );
        },
        
        /**
         * 删除右侧标签页
         * @param tabKey 基准标签页键
         */
        removeRightTabs(tabKey: string) {
            const index = this.tabsList.findIndex(item => item.tabKey === tabKey);
            if (index === -1) return;
            
            // 保留固定标签页和指定标签页左侧的标签页
            this.tabsList = this.tabsList.filter((tab, i) => 
                i <= index || tab.meta?.fixedTag
            );
        },
        
        /**
         * 设置激活标签页
         * @param tabKey 标签页键
         */
        setActiveTab(tabKey: string) {
            if (this.tabsList.some(tab => tab.tabKey === tabKey)) {
                this.activeTabKey = tabKey;
            }
        },
        
        /**
         * 根据路由名称查找标签页
         * @param name 路由名称
         */
        findTabsByName(name: string) {
            return this.tabsList.filter(tab => tab.name === name);
        },
    },
});
