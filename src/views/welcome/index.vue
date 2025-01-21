<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const onJumpLogin = () => {
    router.push('/login');
};
</script>

<template>
    <div>
        欢迎
        <button @click="onJumpLogin">等泰康路</button>
    </div>
</template>

<style scoped></style>
