<script setup lang="ts">
import Motion from '@/utils/motion.ts';
import AccountLogin from './AccountLogin.vue';

const loginMode = ref('account');
</script>

<template>
    <div class="login-form">
        <template v-if="loginMode === 'account'">
            <Motion :delay="50">
                <AccountLogin />
            </Motion>
        </template>
    </div>
</template>

<style scoped lang="scss">
.login-form {
    height: 100%;
    position: relative;
}
</style>
