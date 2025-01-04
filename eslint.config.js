import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
// import pluginVue from "eslint-plugin-vue";
import { defineFlatConfig } from 'eslint-define-config/src';

export default defineFlatConfig([
    {
        ...pluginJs.configs.recommended, // 对js的推荐配置
        // 忽略校验的文件及目录
        ignores: ['*.sh', 'node_modules', '*.md', '.vscode', '.idea', 'dist/**', '/public/*', 'src/assets/**'],
        languageOptions: {
            globals: {
                ...globals.browser, // 浏览器中的常见全局变量的声明，避免eslint报错
            },
        },
        plugins: {},
        rules: {
            // 开启 prettier 自动修复的功能
            'prettier/prettier': 'error',
        },
    },
]);

/** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...pluginVue.configs["flat/essential"],
//   {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
// ];
