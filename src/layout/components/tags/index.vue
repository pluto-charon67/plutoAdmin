<script setup lang="ts">
</script>

<template>
    <div class="tags">
        <div class="tags-left arrow">
            <el-icon><i-ep-user></i-ep-user></el-icon>
        </div>
        <div class="tags-content"></div>
        <div class="tags-right arrow">
            <el-icon><i-ep-Link /></el-icon>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tags {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .arrow {}
    &-left {
    }
    &-content {
        flex: 1;
        overflow-x: auto;
    }
    &-right {
    }
}
</style>
