import {
  ref,
  unref,
  toRefs,
  inject,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  getCurrentInstance,
  type CSSProperties
} from "vue";
import props from "./props";
import Renderer from "../renderer";
import {
  Language,
  PureTableProps,
  TableColumnScope,
  PureTableInstallOptions
} from "../../types";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElConfigProvider,
  ElLoadingDirective
} from "element-plus";

export default defineComponent({
  name: "PureTable",
  props,
  directives: {
    Loading: ElLoadingDirective
  },
  emits: ["page-size-change", "page-current-change"],
  setup(props, { slots, attrs, emit, expose }) {
    const {
      locale: defaultLocale,
      i18n,
      ssr
    } = inject<PureTableInstallOptions>("locale", {
      locale: null,
      i18n: null,
      ssr: false
    });

    const {
      locale,
      columns,
      loading,
      tableKey,
      adaptive,
      pagination,
      alignWhole,
      headerAlign,
      loadingConfig,
      adaptiveConfig,
      rowHoverBgColor,
      showOverflowTooltip
    } = toRefs(props) as unknown as PureTableProps;

    const isClient = ref(false);
    const instance = getCurrentInstance()!;
    let conditions =
      unref(pagination) &&
      unref(pagination).currentPage &&
      unref(pagination).pageSize;


    let convertLoadingConfig = computed(() => {
      if (!unref(loadingConfig)) return;
      let { text, spinner, svg, viewBox } = unref(loadingConfig);
      return {
        "element-loading-text": text,
        "element-loading-spinner": spinner,
        "element-loading-svg": svg,
        "element-loading-svg-view-box": viewBox
      };
    });

    const getStyle = computed((): CSSProperties => {
      return Object.assign(
        {
          width: "100%",
          margin: "16px 0",
          display: "flex",
          flexWrap: "wrap",
          justifyContent:
            unref(pagination).align === "left"
              ? "flex-start"
              : unref(pagination).align === "center"
                ? "center"
                : "flex-end"
        },
        unref(pagination).style ?? {}
      );
    });

    const handleSizeChange = val => {
      unref(pagination).pageSize = val;
      emit("page-size-change", val);
    };

    const handleCurrentChange = val => {
      unref(pagination).currentPage = val;
      emit("page-current-change", val);
    };

    const renderColumns = (columns: Record<string, any>, index: number) => {
      const {
        cellRenderer,
        slot,
        headerRenderer,
        headerSlot,
        hide,
        children,
        prop,
        ...args
      } = columns;

      if (hide && hide(attrs)) {
        return hide(attrs);
      }

      if (hide && hide) {
        return hide;
      }

      const defaultSlots = {
        default: (scope: TableColumnScope) => {
          if (cellRenderer) {
            return (
              <Renderer
                render={cellRenderer}
                params={Object.assign(scope, {
                  index: scope.$index,
                  props,
                  attrs
                })}
              ></Renderer>
            );
          } else if (slot) {
            return slots?.[slot]?.(
              Object.assign(scope, {
                index: scope.$index,
                props,
                attrs
              })
            );
          }
        }
      };

      let scopedSlots = headerRenderer
        ? {
            header: (scope: TableColumnScope) => {
              return (
                <Renderer
                  render={headerRenderer}
                  params={Object.assign(scope, {
                    index: scope.$index,
                    props,
                    attrs
                  })}
                ></Renderer>
              );
            },
            ...defaultSlots
          }
        : slots?.[headerSlot]
          ? {
              header: (scope: TableColumnScope) => {
                return slots?.[headerSlot]?.(
                  Object.assign(scope, {
                    index: scope.$index,
                    props,
                    attrs
                  })
                );
              },
              ...defaultSlots
            }
          : defaultSlots;

      if (children?.length > 0) {
        scopedSlots.default = () => children.map(renderColumns);
      }

      return (
        <ElTableColumn
          key={index}
          {...args}
          prop={prop}
          align={columns?.align ? columns.align : unref(alignWhole)}
          headerAlign={
            columns?.headerAlign ? columns.headerAlign : unref(headerAlign)
          }
          showOverflowTooltip={
            columns?.showOverflowTooltip
              ? columns.showOverflowTooltip
              : unref(showOverflowTooltip)
          }
        >
          {scopedSlots}
        </ElTableColumn>
      );
    };

    const getTableRef = () =>
      instance?.proxy?.$refs[`TableRef${unref(tableKey)}`];

    const getTableDoms = () => (getTableRef() as any).$refs;

    const setAdaptive = async () => {
      await nextTick();
      const tableWrapper = getTableDoms().tableWrapper;
      const offsetBottom = unref(adaptiveConfig).offsetBottom ?? 96;
      tableWrapper.style.height = `${
        window.innerHeight -
        tableWrapper.getBoundingClientRect().top -
        offsetBottom
      }px`;
    };

    const setHeaderSticky = async (zIndex = 3) => {
      await nextTick();
      const headerStyle = getTableDoms().tableHeaderRef.$el.style;
      headerStyle.position = "sticky";
      headerStyle.top = 0;
      headerStyle.zIndex = zIndex;
    };

    onMounted(() => {
      isClient.value = true;
      nextTick(() => {
      });
    });

    onBeforeUnmount(() => {
    });

    expose({
      /** 获取表格实例 */
      getTableRef,
      /** 获取表格多个`Dom`元素 */
      getTableDoms,
      /** 设置表格自适应高度 */
      setAdaptive,
      /** 设置表头为 `sticky` 布局 */
      setHeaderSticky
    });

    let renderTable = () => {
      return (
        <>
          <ElTable {...props} {...attrs} ref={`TableRef${unref(tableKey)}`}>
            {{
              default: () => unref(columns).map(renderColumns),
              append: () => slots.append && slots.append(),
              empty: () => slots.empty && slots.empty()
            }}
          </ElTable>
          {conditions ? (
            <ElPagination
              {...attrs}
              class="pure-pagination"
              style={unref(getStyle)}
              {...unref(pagination)}
              layout={
                unref(pagination).layout ??
                "total, sizes, prev, pager, next, jumper"
              }
              pageSizes={unref(pagination).pageSizes ?? [5, 10, 15, 20]}
              onSizeChange={val => handleSizeChange(val)}
              onCurrentChange={val => handleCurrentChange(val)}
            ></ElPagination>
          ) : null}
        </>
      );
    };

    let renderPureTable = () => {
      return (
        <div
          class="pure-table"
          style="width:100%"
          v-loading={unref(loading)}
          {...unref(convertLoadingConfig)}
        >
          { renderTable()}
        </div>
      );
    };

    console.log('第三课', ssr ? isClient.value && renderPureTable() : renderPureTable())
    return () =>
      ssr ? isClient.value && renderPureTable() : renderPureTable();
  }
});