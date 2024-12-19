<script setup>
import { ElConfigProvider } from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import plusEn from 'plus-pro-components/es/locale/lang/en';
// import plusZhCn from 'plus-pro-components/es/locale/lang/zh-cn';
import { computed } from 'vue';

defineOptions({
    name: 'App',
});

const localeOptions = {
    zh: { ...zhCn },
    en: { ...en },
};
const currentLocale = computed(() => {
    return '';
});
</script>

<template>
    <el-config-provider :locale="currentLocale">
        <router-view />
    </el-config-provider>
</template>

<style scoped></style>
