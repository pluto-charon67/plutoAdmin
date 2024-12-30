<script setup lang="ts">
import Title from "@/views/login/component/Title.vue";

</script>

<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-banner"></div>
      <div class="login-container-form">
        <Title />
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
    }

    &-form {
      width: 300px;
    }

  }

}
</style>