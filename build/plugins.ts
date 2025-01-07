import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from "unplugin-auto-import/vite";

export function getPluginList(): PluginOption[] {
    return  [
        vue(),
        AutoImport({
            // 自动导入vue相关的函数，如ref，reactive等
            imports: ["vue"],
            eslintrc: {
                // 先设置成true，在pnpm run dev后会生成.eslintrc-auto-import.json文件之后，再改为false
                enabled: false,
                filepath: './.eslintrc-auto-import.json', // 生成的文件路径
                globalsPropValue: true,
            },
            // 配置文件生成位置
            dts: "./src/auto-import.d.ts",
        }),
    ];
}

