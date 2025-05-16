import { ref, unref, toRefs, computed, onMounted, onBeforeUnmount, defineComponent, getCurrentInstance, type CSSProperties } from 'vue';
import { Fragment } from 'vue';

import { ElTable, ElTableColumn, ElPagination,ElLoadingDirective } from 'element-plus';

import props from './props';
import type { CustomTableProps, CustomTableCloumnProps, PaginationProps } from './type';
import Renderer from '../renderer';
import debounce from '@/utils/debounce';
import { isFunction, isBoolean } from '@/utils/typeUtils';

interface Emits {
    (e: 'changePage', value: { page: number; size: number }): void;
    (e: 'changesize', value: number): void;
    (e: 'changecurrent', value: number): void;
}

export default defineComponent<CustomTableProps>({
    name: 'CustomTable',
    // 使用element-plus的loading指令，局部注册使用
    directives: {
        Loading: ElLoadingDirective
    },
    props,
    emits: ['changePage'],
    setup(props, { attrs, slots, emit, expose }) {
        const options = toRefs(props);
        const { columns, loading, tableKey, adaptive, adaptiveConfig, align, paginationProps, rowHoverBgColor, showPage } = options;

        // 获取当前自定义表格组件实例
        const instance = getCurrentInstance();

        // 获取element的表格实例-因为直接在setup中函数可能dom还没挂载，故采用函数的方式在合适的时机返回
        const getTableRef = () => instance?.proxy?.$refs[`TableRef${unref(tableKey)}`] as any;

        // 获取表格的dom
        const getTableDom = () => getTableRef()?.$refs;

        // 添加内部数据状态
        const internalData = ref<any[]>([]);
        // 添加内部loading状态
        const internalLoading = ref<boolean | undefined>(undefined);
        // 添加内部columns状态
        const internalColumns = ref<CustomTableCloumnProps[]>([]);
        // 需要过滤的列prop
        const filterColumnProps = ref<string[]>([]);
        // 计算最终的表格数据
        const finalTableData = computed(() => {
            return internalData.value.length > 0 ? internalData.value : props.data || [];
        });

        // 计算最终的loading状态
        const finalLoading = computed(() => {
            return internalLoading.value !== undefined ? internalLoading.value : unref(loading);
        });

        // 计算最终的columns
        const finalColumns = computed(() => {
            const baseColumns = unref(columns) || [];
            const arr = internalColumns.value?.length ? internalColumns.value : baseColumns;
            if (!filterColumnProps.value.length) return arr;
            // 过滤掉需要过滤的列
            return arr.filter(item => !filterColumnProps.value.includes(item.prop as string));
        });

        // 表格设置自适应
        const setAdaptive = async () => {
            await nextTick(); // 保证dom渲染完成
            const tableWrapper = getTableDom().tableWrapper; // 表格的容器
            const offsetBottom = unref(adaptiveConfig).offsetBottom || 0; // 底部偏移量
            // 表格的新高度=视口的高度-表格容器距离视口顶部的距离（即表格上方内容的高度区域）-底部偏移量  这样做会使得表格能占满剩余的所有空间
            tableWrapper.style.height = `${window.innerHeight - tableWrapper.getBoundingClientRect().top - offsetBottom}px`;
        }

        // 表格设置自适应的防抖
        const setAdaptiveDebounce = debounce(setAdaptive, unref(adaptiveConfig)?.timout ?? 100);

        // 设置表头粘性定位
        const setHeaderSticky = async (zIndex: number = 3) => {
            await nextTick(); // 保证dom渲染完成
            const tableHeaderDom = getTableDom().tableHeaderRef.$el; // 表头容器
            tableHeaderDom.style.position = 'sticky';
            tableHeaderDom.style.top = 0;
            tableHeaderDom.style.zIndex = zIndex;
        }

        // 分页器修改了页数或一页显示的条数
        const onchange = (currentPage: number, pageSize: number) => {
            emit('changePage', { page: currentPage, size: pageSize });
        };
        // 分页器修改了页数或一页显示的条数
        const handleSizeChange = (pageSize: number) => {
            emit('changesize', pageSize);
        };
        // 分页器修改了页数
        const handleCurrentChange = (currentPage: number) => {
            emit('changecurrent', currentPage);
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

        // 渲染列
        const renderColumn = (item: CustomTableCloumnProps, index: number) => {
            const { cellRenderer, slot, headerRenderer, headerSlot, hide, children, prop, ...reset } = item;

            // 如果列隐藏，则不渲染
            if (isFunction(hide) && hide({ item, attrs })) return;
            if (isBoolean(hide) && hide) return;

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
                <Fragment>
                    <ElTable {...props} {...attrs} data={finalTableData.value} ref={`TableRef${unref(tableKey)}`}>
                        {{
                            default: () => finalColumns.value.map((item, index) => renderColumn(item, index)),
                            append: () => slots.append && slots.append(),
                            empty: () => slots.empty && slots.empty(),
                        }}
                    </ElTable>
                    {unref(showPage) && (
                        <ElPagination
                            {...unref(paginationProps)}
                            style={getPaginationStyle.value}
                            layout={unref(paginationProps)?.layout ?? 'total, prev, pager, next, jumper'}
                            pageSizes={unref(paginationProps)?.pageSizes ?? [10, 30, 50, 100]}
                            onSizeChange={handleSizeChange}
                            onCurrentChange={handleCurrentChange}
                            onChange={(currentPage: number, pageSize: number) => onchange(currentPage, pageSize)}
                        ></ElPagination>
                    )}
                </Fragment>
            );
        };

        const renderCustomTable = () => {
            return (<div class="custom-table" v-loading={finalLoading.value}>
                {renderTable()}
            </div>)
        }

        onMounted(() => {
            nextTick(() => {
                if (unref(rowHoverBgColor)) {
                    // 设置表格行hover的背景颜色，通过修改element-ui-plus的css变量实现
                    getTableDom().tableWrapper.style.setProperty('--el-table-row-hover-bg-color', unref(rowHoverBgColor), "important");
                }
                if (unref(adaptive)) {
                    console.log(getTableDom())
                    setAdaptive();
                    window.addEventListener('resize', setAdaptiveDebounce); // 监听窗口大小变化，表格高度自适应
                    // 表格高度自适应也同时设置表头粘性定位
                    if (unref(adaptiveConfig)?.fixHeader) setHeaderSticky(unref(adaptiveConfig)?.zIndex ?? 3);
                }
            })
        })

        onBeforeUnmount(() => {
            if (unref(adaptive)) {
                window.removeEventListener('resize', setAdaptiveDebounce); // 移除窗口大小变化监听
            }
        })

        expose({
            getTableRef, // 暴露表格实例
            setTableData: (data: any[]) => {
                internalData.value = data;
            },
            // 清除内部数据，恢复使用props的data
            clearTableData: () => {
                internalData.value = [];
            },
            // 设置loading状态
            setLoading: (value: boolean) => {
                internalLoading.value = value;
            },
            // 清除内部loading状态，恢复使用props的loading
            clearLoading: () => {
                internalLoading.value = undefined;
            },
            // 设置列配置
            setColumns: (newColumns: CustomTableCloumnProps[]) => {
                internalColumns.value = newColumns;
            },
            // 追加列配置
            appendColumns: (newColumns: CustomTableCloumnProps | CustomTableCloumnProps[]) => {
                const columnsToAdd = Array.isArray(newColumns) ? newColumns : [newColumns];
                internalColumns.value.push(...columnsToAdd);
            },
            // 移除列配置
            removeColumns: (props: string | string[]) => {
                const propsToRemove = Array.isArray(props) ? props : [props];
                filterColumnProps.value = propsToRemove
            },
            // 重置列配置-将内部维护的列配置置空
            resetColumns: () => {
                internalColumns.value = []; 
                filterColumnProps.value = [];
            },
            // 获取列配置
            getColumns: () => {
                return finalColumns.value;
            },
        })

        return renderCustomTable
    },
});
