import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from "unplugin-auto-import/vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import vueJsx from '@vitejs/plugin-vue-jsx';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

export function getPluginList(): PluginOption[] {
    return  [
        vue(),
        vueJsx(), // 使用jsx
        // 处理函数、API、工具方法的导入
        AutoImport({
            // 自动导入vue相关的函数，如ref，reactive等
            imports: ["vue"],
            eslintrc: {
                // 先设置成true，在pnpm run dev后会生成.eslintrc-auto-import.json文件之后，再改为false
                enabled: false,
                filepath: './.eslintrc-auto-import.json', // 生成的文件路径
                globalsPropValue: true,
            },
            // 导入的文件目录配置
            dirs: [
                '../src/hooks/auto-import/**',
            ],
            // 自动导入解析器配置
            resolvers: [
            ],
            // 生成 TypeScript 声明文件的位置
            dts: "./src/auto-import.d.ts",
        }),
        // 配置图标自动导入
        Icons({
            autoInstall: true, // 自动安装图标包
            compiler: 'vue3', // 指定框架为 Vue3
        }),
        // 配置 Mock 数据服务
        vitePluginFakeServer({
            // 线上部署faker进行数据mock
            logger: false, // 是否在控制台显示请求日志
            include: "mock", // 设置存储mock数据的文件夹
            infixName: false, // 取消mock文件的中缀名
            enableProd: true, // 是否在生产环境设置mock
        }),
    ];
}

