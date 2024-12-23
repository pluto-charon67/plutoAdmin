import { ImportGlobOptions } from 'vite';

/**
 * 批量导入模块
 * @param paths 路径
 * @param options 配置，默认eager: true,
 */
export default function (paths: string | Array<string>, options?: ImportGlobOptions<boolean, string> = { eager: true }) {
    return import.meta.glob(`${paths}`, options);
}
