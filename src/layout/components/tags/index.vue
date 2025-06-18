<script setup lang="ts">
import LeftIcon from "~icons/ic/round-keyboard-double-arrow-left";
import RightIcon from "~icons/ic/round-keyboard-double-arrow-right";
</script>

<template>
    <div class="tags">
        <div class="tags-left arrow">
            <LocalIcon :icon="LeftIcon" />
        </div>
        <div class="tags-content"></div>
        <div class="tags-right arrow">
            <LocalIcon :icon="RightIcon" />
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
    &-left {
        cursor: w-resize;
    }
    &-content {
        flex: 1;
        overflow-x: auto;
    }
    &-right {
        cursor: e-resize;
    }
}
</style>
