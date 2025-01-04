import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const url = import.meta.url;
export function getPathResolve(dir = '.', metaUrl = url) {
    // 当前文件目录的绝对路径
    const currentFileDir = dirname(fileURLToPath(metaUrl));
    // build目录的绝对路径
    const buildDir = resolve(currentFileDir, 'build');
    // 解析的绝对路径
    const resolvedPath = resolve(currentFileDir, dir);
    // 检查解析的绝对路径是否在build目录内,在的话就返回当前的文件路径
    if (resolvedPath.startsWith(buildDir)) return fileURLToPath(metaUrl);
    // 不在build目录内就返回解析之后的绝对路径
    return resolvedPath;
}
