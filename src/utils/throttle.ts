/**
 * 节流函数 - 限制函数在一定时间内只能执行一次
 * 
 * @param fn 需要节流的函数
 * @param delay 延迟时间，单位毫秒
 * @param options 配置选项
 * @param options.leading 是否在延迟开始前调用函数，默认 true
 * @param options.trailing 是否在延迟结束后调用函数，默认 true
 * @returns 节流后的函数
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 200,
  options: { leading?: boolean; trailing?: boolean } = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  // 实际执行函数
  const invoke = (thisArg: any, args: Parameters<T>) => {
    fn.apply(thisArg, args);
    lastTime = Date.now();
  };

  // 清除定时器
  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // 返回节流函数
  const throttled = function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    // 保存上下文和参数
    lastThis = this;
    lastArgs = args;

    // 首次调用或者已经超过延迟时间
    if (remaining <= 0 || remaining > delay) {
      cancel();
      
      // 如果是首次调用且不需要立即执行，则不执行
      if (lastTime === 0 && !leading) {
        lastTime = now;
        return;
      }
      
      invoke(lastThis, lastArgs);
      return;
    }

    // 如果需要在延迟结束后调用且没有设置定时器
    if (trailing && timer === null) {
      timer = setTimeout(() => {
        timer = null;
        lastTime = leading ? Date.now() : 0;
        if (lastArgs) {
          invoke(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, remaining);
    }
  } as ThrottledFunction<T>;

  // 添加取消方法
  throttled.cancel = cancel;

  return throttled;
}

/**
 * 基于 requestAnimationFrame 的高性能节流函数
 * 
 * @param fn 需要节流的函数
 * @returns 节流后的函数
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): ThrottledFunction<T> {
  let requestId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const throttled = function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        requestId = null;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      });
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };

  return throttled;
}

export default throttle; 