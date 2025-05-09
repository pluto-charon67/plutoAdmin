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

type TableProps = Parameters<Exclude<(typeof ElTable)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
};

type TableColumnProps = Parameters<Exclude<(typeof ElTableColumn)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
};

type PaginationProps = Parameters<Exclude<(typeof ElPagination)['setup'], undefined>>[0] & {
    customRender: (...args: any[]) => VNode;
}

interface CustomTableCloumnProps extends TableColumnProps {}

interface CustomTableProps extends TableProps {
    paginationProps?: PaginationProps; // 分页器相关的props
    rowHoverBgColor?: string; // 鼠标悬停行背景色
    showPage?: boolean;// 是否要显示分页器
    columns: CustomTableCloumnProps[]; // 列配置
}

export type { TableColumnProps,TableProps,CustomTableProps,CustomTableCloumnProps };
