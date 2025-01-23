<script setup lang="ts">
import type { FormInstance } from 'element-plus';

const form = reactive<FormInstance>({});
</script>

<template>
    <div class="account">
        <el-form :model="form">
            <el-form-item prop="username">
                <el-input clearable v-model="form.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input clearable show-password v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item prop=""></el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
