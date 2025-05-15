/**
 * 将数值的整数部分进行千分位分割
 * @param value 要格式化的数值或字符串
 * @param options 格式化选项
 * @returns 格式化后的字符串
 * @example
 * // 基本使用
 * formatThousands(1234567.89) // '1,234,567.89'
 * // 处理整数
 * formatThousands(1234567) // '1,234,567'
 * // 处理字符串数值
 * formatThousands('1234567.89') // '1,234,567.89'
 * // 自定义分隔符
 * formatThousands(1234567.89, { separator: ' ' }) // '1 234 567.89'
 */
function formatThousands(
    value: number | string,
    options: {
        /** 千分位分隔符 */
        separator?: string;
    } = {}
): string {
    const { separator = ',' } = options;

    // 将输入转换为字符串
    const strValue = String(value);

    // 检查是否为有效数值
    if (!/^-?\d*\.?\d*$/.test(strValue)) {
        console.warn('无效的数值格式');
        return strValue;
    }

    // 分离整数部分和小数部分
    const [integerPart, decimalPart] = strValue.split('.');

    // 处理负号
    const isNegative = integerPart.startsWith('-');
    const absoluteIntegerPart = isNegative ? integerPart.slice(1) : integerPart;

    // 对整数部分进行分组
    const formattedInteger = absoluteIntegerPart
        .split('')
        .reverse()
        .reduce((acc, digit, index) => {
            const shouldAddSeparator = index > 0 && index % 3 === 0;
            return shouldAddSeparator ? `${digit}${separator}${acc}` : `${digit}${acc}`;
        }, '');

    // 组合最终结果
    let result = isNegative ? `-${formattedInteger}` : formattedInteger;
    
    // 如果有小数部分，添加小数部分
    if (decimalPart !== undefined) {
        result += `.${decimalPart}`;
    }

    return result;
}

export default formatThousands;

/**
 * 移除数值中的千分位分隔符
 * @param value 包含千分位分隔符的字符串
 * @param options 格式化选项
 * @returns 移除分隔符后的数值字符串
 * @example
 * // 基本使用
 * removeThousandsSeparator('1,234,567.89') // '1234567.89'
 * // 自定义分隔符
 * removeThousandsSeparator('1 234 567.89', { separator: ' ' }) // '1234567.89'
 */
export function removeThousandsSeparator(
    value: string,
    options: {
        /** 千分位分隔符 */
        separator?: string;
    } = {}
): string {
    const { separator = ',' } = options;
    return value.replace(new RegExp(`\\${separator}`, 'g'), '');
}

/**
 * 将数值格式化为指定的小数位数
 * @param value 要格式化的数值或字符串
 * @param decimals 保留的小数位数，默认为2，必须大于等于0
 * @returns 格式化后的字符串
 */
export function formatDecimal(
    value: number | string,
    decimals: number = 2
): string {
    // 验证小数位数必须大于等于0
    if (decimals < 0 || !Number.isInteger(decimals)) {
        throw new Error('小数位数必须是大于等于0的整数');
    }

    // 将输入转换为数值
    const numValue = Number(value);

    // 检查是否为有效数值
    if (isNaN(numValue)) {
        console.warn('无效的数值格式');
        return String(value);
    }

    // 使用toFixed进行格式化，它会自动处理四舍五入
    return numValue.toFixed(decimals);
} 