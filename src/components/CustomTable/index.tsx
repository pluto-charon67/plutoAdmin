import { ref, unref, toRefs, computed, onMounted, onBeforeMount, defineComponent, type CSSProperties } from 'vue';

import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

import props from './props';
import type { CustomTableProps, CustomTableCloumnProps } from './type';
import Renderer from '../renderer';

export default defineComponent<CustomTableProps>({
    name: 'CustomTable',
    props,
    emits: [],
    setup(props, { attrs, slots, emit, expose }) {
        const options = toRefs(props);
        console.log('表格组件', props, options, '+++');
        const { columns, loading, tableKey, adaptive, adaptiveConfig, align, paginationProps, rowHoverBgColor, showPage } = options;

        // 分页器修改了一页显示多少条数据
        const handleSizeChange = (val: number) => {
            console.log('修改有', val);
        };

        // 分页器修改了页数
        const handlePageChange = (val: number) => {
            console.log('修改页数', val);
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

        const renderTable = () => {
            return (
                <div class="custom-table">
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
                            layout={unref(paginationProps).layout ?? 'total, prev, pager, next, jumper'}
                            pageSizes={unref(paginationProps).pageSizes ?? [10, 30, 50, 100]}
                            onSizeChange={val => handleSizeChange(val)}
                            onCurrentChange={val => handlePageChange(val)}
                        />
                    )}
                </div>
            );
        };

        const res = renderTable();
        console.log('表格组件渲染结果', res);
        return res;
    },
});
