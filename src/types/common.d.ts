import type { ResponseData } from '@/utils/http/index.ts';
// 全局共用的类型
declare global {
    // 后端返回的基础数据结构
    interface ResponseData extends ResponseData {}
}
