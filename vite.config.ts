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
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@assets/": path.join(__dirname, "./src/assets"),
      }
    }
  };
})
