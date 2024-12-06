import { defineConfig, loadEnv } from 'vite';
import path, {resolve} from 'path';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  // 根路径
  const root = process.cwd();
  const env =loadEnv(mode, root);
  console.log(env);

  return {
    plugins: [vue()],
    base: env.VITE_PUBLIC_PATH, // 公共基础路径
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@assets/": path.join(__dirname, "./src/assets"),
      }
    },
    server: {
      host: "0.0.0.0",
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      },
    },
    build: {
      outDir: 'dist', // 指定打包输出目录
      assetsInlineLimit: 4 * 1024, // 小于4kb的静态资源，进行base64编码引用,减少请求
      sourcemap: false, // 构建后是否生成sourcemap
      chunkSizeWarningLimit: 2000, // 规定触发警告的 chunk 大小单位kb
    },
  };
})
