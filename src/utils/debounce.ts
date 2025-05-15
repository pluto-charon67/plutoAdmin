/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 经过防抖处理的函数
 */
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 300,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout | null = null;
    
    return function (this: any, ...args: Parameters<T>) {
        // 如果timer存在，清除定时器
        if (timer) clearTimeout(timer);
        
        // 立即执行
        if (immediate) {
            // 如果没有定时器，立即执行
            const callNow = !timer;
            // 设置定时器，delay毫秒后将timer设为null
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            
            if (callNow) fn.apply(this, args);
        } else {
            // 非立即执行，设置定时器，delay毫秒后执行函数
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    };
} 

export default debounce;