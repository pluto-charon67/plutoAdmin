import type { ElTable, ElTableColumn,ElPagination } from 'element-plus';

type A = typeof ElTableColumn['setup'];
type V = Parameters<A>;

// 用于展开嵌套泛型
type ExpandNestedGeneric<T> = T extends object
    ? T extends Function
        ? T
        : T extends infer O
          ? { [K in keyof O]: ExpandNestedGeneric<O[K]> }
          : never
    : T;

type TableProps = Partial<Parameters<Exclude<(typeof ElTable)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
}>;

type TableColumnProps =Partial<Parameters<Exclude<(typeof ElTableColumn)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
}>;

type PaginationProps = Parameters<Exclude<(typeof ElPagination)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
}


interface CustomTableCloumnProps extends TableColumnProps {
    hide?: boolean | CallableFunction; // 是否隐藏
    slot?: string; // 自定义插槽
    headerSlot?: string; // 自定义表头插槽
    // 多级表头
    children?: CustomTableCloumnProps[];
    // 自定义单元格渲染器(jsx语法)
    cellRenderer?: (data: any) => VNode | string;
    // 自定义表头渲染器(jsx语法)
    headerRenderer?: (data: any) => VNode | string;
}

interface AdaptiveConfig {
    offsetBottom?: number; // 表格距离页面底部的距离，即安全距离
    fixHeader?: boolean; // 是否固定表头
    timout?: number; // 页面resize时防抖的时间，单位为ms
    zIndex?: number; // 表头的z-index
}

interface CustomTableProps extends TableProps {
    tableKey?: string | number; // 表格的唯一标识，如何一个页面存在多个表格，但是只获取到一个表格实例时，设置tableKey可以解决
    paginationProps?: PaginationProps; // 分页器相关的props
    rowHoverBgColor?: string; // 鼠标悬停行背景色
    showPage?: boolean;// 是否要显示分页器
    columns: CustomTableCloumnProps[]; // 列配置
    loading?: boolean; // 是否开启加载动画
    align?: 'left' | 'center' | 'right'; // 表格列对齐方式
    adaptive?: boolean; // 是否自适应宽度 让表格的高度自动填充完当前页面的全部剩余空间
    adaptiveConfig?: AdaptiveConfig; // 自适应配置
}

export type { TableColumnProps,TableProps,CustomTableProps,CustomTableCloumnProps,AdaptiveConfig };
