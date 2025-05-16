/**
 * 类型判断工具函数
 */

type BasicType = 
  | 'string' 
  | 'number' 
  | 'boolean'
  | 'undefined'
  | 'symbol'
  | 'bigint'
  | 'function'
  | 'object'
  | 'array'
  | 'date'
  | 'regexp'
  | 'null'
  | 'promise';

/**
 * 获取值的具体类型
 * @param value - 需要判断类型的值
 * @returns 返回类型字符串
 */
export const getType = (value: unknown): BasicType => {
  if (value === null) return 'null';
  
  const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  
  if (type === 'array' || 
      type === 'date' || 
      type === 'regexp' || 
      type === 'promise' ||
      type === 'null') {
    return type as BasicType;
  }
  
  return typeof value as BasicType;
};

/**
 * 判断是否为字符串
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * 判断是否为数字
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);

/**
 * 判断是否为布尔值
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * 判断是否为纯对象
 */
export const isObject = (value: unknown): value is Record<string, any> => {
  if (value === null || typeof value !== 'object') return false;
  return Object.getPrototypeOf(value) === Object.prototype;
};

/**
 * 判断是否为数组
 */
export const isArray = Array.isArray;

/**
 * 判断是否为函数
 */
export const isFunction = (value: unknown): value is Function => typeof value === 'function';

/**
 * 判断是否为空值 (null 或 undefined)
 */
export const isNil = (value: unknown): value is null | undefined => value === null || value === undefined;

/**
 * 判断是否为Promise
 */
export const isPromise = (value: unknown): value is Promise<any> => {
  return value instanceof Promise || (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as any).then === 'function' &&
    typeof (value as any).catch === 'function' &&
    typeof (value as any).finally === 'function'
  );
};

/**
 * 判断是否为日期对象
 */
export const isDate = (value: unknown): value is Date => {
  return Object.prototype.toString.call(value) === '[object Date]';
};

/**
 * 判断是否为正则表达式
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}; 