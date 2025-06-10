<script setup lang="ts">
import Tags from '@/layout/components/tags/index.vue';
import Content from '@/layout/components/content/index.vue';
import { getAsyncRoutes } from '@/api/router/index.ts';

getAsyncRoutes().then(res => {
    const data = res.data;
});
</script>

<template>
    <div class="app-wrapper">
        <Tags></Tags>
        <Content></Content>
    </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
}
</style>
