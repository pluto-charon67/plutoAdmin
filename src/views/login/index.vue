<script setup lang="ts">
import Banner from '@/views/login/component/Banner.vue';
import LoginForm from '@/views/login/component/LoginForm.vue';
</script>

<template>
    <div class="login">
        <div class="login-container">
            <div class="login-container-banner">
                <Banner />
            </div>
            <div class="login-container-form">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login {
    height: 100vh;
    position: relative;
    overflow: hidden;

    &-container {
        width: max-content;
        padding: 30px 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: rgb(242, 243, 245) 0px 0px 8px 1px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;

        &-banner {
            height: 500px;
            width: 600px;
            position: relative;
        }

        &-form {
            width: 300px;
        }
    }
}
</style>
