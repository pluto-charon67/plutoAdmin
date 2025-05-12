import { ref, unref, toRefs, computed, onMounted, onBeforeMount, defineComponent, type CSSProperties } from 'vue';

import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

import props from './props';
import type { CustomTableProps, CustomTableCloumnProps } from './type';
import Renderer from '../renderer';

interface Emits {
    (e: 'changePage', value: { page: number; size: number }): void;
}

export default defineComponent<CustomTableProps>({
    name: 'CustomTable',
    props,
    emits: ['changePage'],
    setup(props, { attrs, slots, emit, expose }) {
        const options = toRefs(props);
        const { columns, loading, tableKey, adaptive, adaptiveConfig, align, paginationProps, rowHoverBgColor, showPage } = options;

        // 分页器修改了页数或一页显示的条数
        const onchange = (currentPage: number, pageSize: number) => {
            emit('changePage', { page: currentPage, size: pageSize });
        };

        // 渲染列
        const renderColumn = (item: CustomTableCloumnProps, index: number) => {
            console.log('渲染列', item, index);
            const { cellRenderer, slot, headerRenderer, headerSlot, hide, children, prop, ...reset } = item;

            // 默认的插槽内容查找
            const defaultSlot = {
                default: (scope: any) => {
                    const data = Object.assign(scope, { index: scope.$index, props, attrs });
                    // 存在单元格的渲染函数
                    if (cellRenderer) return <Renderer render={cellRenderer} params={data}></Renderer>;
                    // 假如有单元格的具名插槽
                    if (slot) return slots?.[slot]?.(data);
                },
            };

            // 单元格插槽，包括标题和内容等等
            let scopedSlots;
            // 渲染函数的优先级比表头的具名插槽高
            if (headerRenderer) {
                // 表头的渲染函数
                scopedSlots = {
                    header: (scope: any) => {
                        const data = Object.assign(scope, { index: scope.$index, props, attrs });
                        return <Renderer render={headerRenderer} params={data}></Renderer>;
                    },
                    // 其他插槽合并进去
                    ...defaultSlot,
                };
            } else if (headerSlot) {
                // 表头的具名插槽
                scopedSlots = {
                    header: (scope: any) => {
                        const data = Object.assign(scope, { index: scope.$index, props, attrs });
                        return slots?.[headerSlot]?.(data);
                    },
                    // 其他插槽合并进去
                    ...defaultSlot,
                };
            } else {
                // 默认的插槽内容
                scopedSlots = defaultSlot;
            }

            // 存在多级表头
            if (children?.length) {
                scopedSlots.default = () => children.map(renderColumn);
            }

            return (
                // 当没有设置列的对齐方式时，采用表格整体的对齐方式
                <ElTableColumn
                    key={item.label || index}
                    {...reset}
                    prop={prop}
                    align={item.align ?? unref(align)}
                    headerAlign={item.headerAlign ?? unref(align)}
                >
                    {scopedSlots}
                </ElTableColumn>
            );
        };

        // 获取分页器的样式
        const getPaginationStyle = computed((): CSSProperties => {
            const align = unref(paginationProps)?.align;
            return Object.assign({
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
            }, unref(paginationProps)?.style ?? {});
        })

        const renderTable = () => {
            return (
                <>
                    <ElTable {...props} {...attrs} ref={`TableRef${unref(tableKey)}`}>
                        {{
                            default: () => unref(columns).map((item, index) => renderColumn(item, index)),
                            append: () => slots.append && slots.append(),
                            empty: () => slots.empty && slots.empty(), //
                        }}
                    </ElTable>
                    {/* 判断是否需要渲染分页器 */}
                    {unref(showPage) && (
                        <ElPagination
                            {...unref(paginationProps)}
                            style={getPaginationStyle}
                            layout={unref(paginationProps).layout ?? 'total, prev, pager, next, jumper'}
                            pageSizes={unref(paginationProps).pageSizes ?? [10, 30, 50, 100]}
                            onChange={(currentPage: number, pageSize: number) => onchange(currentPage, pageSize)}
                        />
                    )}



                </>
            );
        };


        const renderCustomTable = () => {
            return (<div class="custom-table">
                {renderTable()}
            </div>)
        }

        return renderCustomTable
    },
});
