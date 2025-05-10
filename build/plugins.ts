import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from "unplugin-auto-import/vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import vueJsx from '@vitejs/plugin-vue-jsx';

export function getPluginList(): PluginOption[] {
    return  [
        vue(),
        vueJsx(), // 使用jsx
        AutoImport({
            // 自动导入vue相关的函数，如ref，reactive等
            imports: ["vue"],
            eslintrc: {
                // 先设置成true，在pnpm run dev后会生成.eslintrc-auto-import.json文件之后，再改为false
                enabled: false,
                filepath: './.eslintrc-auto-import.json', // 生成的文件路径
                globalsPropValue: true,
            },
            // 导入的文件
            dirs: [
                '../src/hooks/auto-import/**',
            ],
            // 配置文件生成位置
            dts: "./src/auto-import.d.ts",
        }),
        vitePluginFakeServer({
            // 线上部署faker进行数据mock
            logger: false, // 是否在控制台显示请求日志
            include: "mock", // 设置存储mock数据的文件夹
            infixName: false, // 取消mock文件的中缀名
            enableProd: true, // 是否在生产环境设置mock
        }),
    ];
}

