import { defineConfig, loadEnv } from 'vite';
import path, { resolve } from 'path';
import { getPluginList } from './build/plugins';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // 根路径
    const root = process.cwd();
    const env = loadEnv(mode, root);

    return {
        base: env.VITE_PUBLIC_PATH, // 公共基础路径
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '@assets': path.join(__dirname, 'src/assets'),
            },
        },
        server: {
            host: '0.0.0.0',
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            },
        },
        build: {
            outDir: 'dist', // 指定打包输出目录
            assetsInlineLimit: 4 * 1024, // 小于4kb的静态资源，进行base64编码引用,减少请求
            sourcemap: false, // 构建后是否生成sourcemap
            chunkSizeWarningLimit: 2000, // 规定触发警告的 chunk 大小单位kb
            minify: 'terser', // 默认为esbuild打包更快但是不能去除console.log，terser打包慢但能去除console.log同时也需要安装terser
            terserOptions: {
                compress: {
                    keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
                    drop_console: true, // 生产环境去除 console
                    drop_debugger: true, // 生产环境去除 debugger
                },
                format: {
                    comments: false, // 删除注释
                },
            },
            rollupOptions: {
                // 静态资源分类打包
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js', // 非入口的动态加载模块文件打包输出的目录及命名格式
                    entryFileNames: 'static/js/[name]-[hash].js', // 入口文件即main.js文件的输出目录及命名格式
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 静态资源文件的输出目录及格式
                },
            },
        },
        plugins: getPluginList(),
    };
});
