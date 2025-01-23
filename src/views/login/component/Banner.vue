<script setup lang="ts"></script>

<template>
    <div class="box">
        <div class="box-info">
            <div class="box-info-logo">
                <img src="@/assets/logo/logo2.png" alt="" />
            </div>
            <div class="box-info-name">pluto-admin</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.box {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/bg.png');
    background-size: cover;
    &-info {
        width: 100%;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        &-logo {
            height: 30px;
            img {
                height: 100%;
                object-fit: cover;
            }
        }
        &-name {
            margin-left: 4px;
            font-weight: bold;
            color: var(--el-color-primary);
            font-size: 16px;
        }
    }
}
</style>
