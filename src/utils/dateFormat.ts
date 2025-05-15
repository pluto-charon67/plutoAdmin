/**
 * 日期格式化工具函数
 */

/**
 * 补零函数
 * @param num 需要补零的数字
 * @returns 补零后的字符串
 */
const padZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
};

/**
 * 使用自定义格式字符串格式化日期
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式字符串，支持以下占位符：
 * - yyyy: 年份，如 2024
 * - MM: 月份，如 03
 * - dd: 日期，如 15
 * - HH: 24小时制，如 14
 * - hh: 12小时制，如 02
 * - mm: 分钟，如 30
 * - ss: 秒，如 25
 * - SSS: 毫秒，如 123
 * @returns 格式化后的日期字符串
 * @example
 * // 基本使用
 * formatDateByPattern(new Date(), 'yyyy-MM-dd') // 2024-03-15
 * // 带时间
 * formatDateByPattern(new Date(), 'yyyy-MM-dd HH:mm:ss') // 2024-03-15 14:30:25
 * // 12小时制
 * formatDateByPattern(new Date(), 'yyyy/MM/dd hh:mm:ss') // 2024/03/15 02:30:25
 * // 带毫秒
 * formatDateByPattern(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS') // 2024-03-15 14:30:25.123
 */
function formatDateByPattern(
    date: Date | number | string,
    format: string = 'yyyy-MM-dd'
): string {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
        console.warn('无效的日期格式');
        return '';
    }

    const year = dateObj.getFullYear();
    const month = padZero(dateObj.getMonth() + 1);
    const day = padZero(dateObj.getDate());
    const hours24 = padZero(dateObj.getHours());
    const hours12 = padZero(dateObj.getHours() % 12 || 12);
    const minutes = padZero(dateObj.getMinutes());
    const seconds = padZero(dateObj.getSeconds());
    const milliseconds = dateObj.getMilliseconds().toString().padStart(3, '0');

    return format.replace(/yyyy|MM|dd|HH|hh|mm|ss|SSS/g, (match) => {
        switch (match) {
            case 'yyyy': return `${year}`;
            case 'MM': return `${month}`;
            case 'dd': return `${day}`;
            case 'HH': return `${hours24}`;
            case 'hh': return `${hours12}`;
            case 'mm': return `${minutes}`;
            case 'ss': return `${seconds}`;
            case 'SSS': return `${milliseconds}`;
            default: return match;
        }
    });
} 

export default formatDateByPattern;