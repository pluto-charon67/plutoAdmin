<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
console.log(router);
const onJumpLogin = () => {
  router.push({
    name: 'Login',
  });
};
</script>

<template>
    <div>布局
      <button @click="onJumpLogin">得名</button>
    </div>
</template>

<style scoped></style>
