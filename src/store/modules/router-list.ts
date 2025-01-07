import { defineStore } from 'pinia';

export const useTagsSTore = defineStore('router-list', {
    state: () => ({
        tabsList: [], // 标签页数据
    }),
    getters: {},
    actions: {
        addTabs(data) {},
    },
});
