import { defineComponent, ref, PropType, computed, Fragment, h, watch, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { MaSearchProps, MaSearchOptions, MaSearchItem, MaSearchExpose } from './types'
import { MaFormOptions } from '../CutsomForm/types'
import CustomForm from '../CutsomForm'
import { rafThrottle } from '@/utils/throttle'

export default defineComponent<MaSearchProps>({
  name: 'CustomSearch',
  props: {
    defaultValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    options: {
      type: Object as PropType<MaSearchOptions>,
      default: () => ({})
    },
    formOptions: {
      type: Object as PropType<MaFormOptions>,
      default: () => ({})
    },
    searchItems: {
      type: Array as PropType<MaSearchItem[]>,
      default: () => []
    }
  },
  emits: ['search', 'reset', 'fold'],
  setup(props, { emit, expose, slots }) {
    const formRef = ref()
    const searchOptions = ref<MaSearchOptions>({
      fold: props.options?.fold ?? false,
      foldRows: props.options?.foldRows ?? 2,
      cols: props.options?.cols ?? {
        xs: 2,
        sm: 3,
        md: 4,
        lg: 6,
        xl: 6
      },
      show: true,
      text: {
        searchBtn: () => '搜索',
        resetBtn: () => '重置',
        isFoldBtn: () => '展开',
        notFoldBtn: () => '折叠'
      },
      ...props.options
    })
    const searchItems = ref<MaSearchItem[]>(props.searchItems)

    // 内部维护的表单数据
    const formData = ref<Record<string, any>>({})

    // 添加窗口宽度的响应式引用
    const windowWidth = ref(window.innerWidth)

    // 更新窗口宽度的处理函数
    const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth
    }

    // 使用 rafThrottle 优化窗口大小变化监听
    const throttledUpdateWidth = rafThrottle(updateWindowWidth)

    // 组件挂载时添加事件监听
    onMounted(() => {
      window.addEventListener('resize', throttledUpdateWidth)
    })

    // 组件卸载时移除事件监听
    onUnmounted(() => {
      window.removeEventListener('resize', throttledUpdateWidth)
      // 取消可能未执行的节流函数
      throttledUpdateWidth.cancel()
    })

    // 初始化表单数据
    const initFormData = () => {
      const data: Record<string, any> = {}
      searchItems.value.forEach(item => {
        if (item.prop) {
          // 只使用 props.defaultValue
          data[item.prop] = props.defaultValue[item.prop] ?? undefined
        }
      })
      formData.value = data
    }

    // 监听 searchItems 变化，重新初始化表单数据
    watch(() => props.searchItems, () => {
      searchItems.value = props.searchItems
      initFormData()
    }, { deep: true })

    // 监听默认值变化
    watch(() => props.defaultValue, () => {
      initFormData()
    }, { deep: true })

    // 初始化
    initFormData()

    // 计算实际显示的表单项
    const visibleItems = computed(() => {
      return searchItems.value.filter(item => {
        if (typeof item.hide === 'function') {
          return !item.hide()
        }
        return !item.hide
      })
    })

    // 计算当前显示的列数，使用 windowWidth 响应式引用
    const currentCols = computed(() => {
      const width = windowWidth.value
      const { cols = {} } = searchOptions.value
      if (width < 768) return cols.xs || 2
      if (width < 992) return cols.sm || 3
      if (width < 1200) return cols.md || 4
      if (width < 1920) return cols.lg || 6
      return cols.xl || 6
    })

    // 计算是否需要显示折叠按钮
    const showFoldBtn = computed(() => {
      const { foldRows = 2 } = searchOptions.value
      return visibleItems.value.length > foldRows * (currentCols.value || 1)
    })

    // 计算显示的表单项
    const displayItems = computed(() => {
      const items = searchOptions.value.fold
        ? visibleItems.value.slice(0, searchOptions.value.foldRows * currentCols.value)
        : visibleItems.value
      return items
    })

    // 处理搜索
    const handleSearch = () => {
      emit('search', formData.value)
    }

    // 处理重置
    const handleReset = () => {
      initFormData() // 重置为默认值
      emit('reset', formData.value)
    }

    // 处理折叠切换
    const handleFoldToggle = () => {
      searchOptions.value.fold = !searchOptions.value.fold
      emit('fold', searchOptions.value.fold)
    }

    const itemList = computed(() => {
      return displayItems.value.map(item => {
        return {
          ...item,
          cols: {
            span: 24 / currentCols.value,
            ...item.cols
          }
        };
      });
    })
    // 暴露方法
    expose({
      getMaFormRef: () => formRef.value,
      foldToggle: handleFoldToggle,
      getFold: () => searchOptions.value.fold,
      setSearchForm: (form: Record<string, any>) => {
        formData.value = { ...form }
      },
      getSearchForm: () => formData.value,
      setShowState: (show: boolean) => {
        searchOptions.value.show = show
      },
      getShowState: () => searchOptions.value.show,
      setOptions: (options: MaSearchOptions) => {
        searchOptions.value = options
      },
      getOptions: () => searchOptions.value,
      setFormOptions: (options: MaFormOptions) => {
        formRef.value?.setOptions(options)
      },
      getFormOptions: () => formRef.value?.getOptions(),
      setItems: (items: MaSearchItem[]) => {
        searchItems.value = items
        initFormData()
      },
      getItems: () => searchItems.value,
      appendItem: (item: MaSearchItem) => {
        searchItems.value.push(item)
        if (item.prop) {
          const defaultValue = props.defaultValue[item.prop] ?? undefined
          formData.value[item.prop] = defaultValue
        }
      },
      removeItem: (prop: string) => {
        const index = searchItems.value.findIndex(item => item.prop === prop)
        if (index > -1) {
          searchItems.value.splice(index, 1)
          delete formData.value[prop]
        }
      },
      getItemByProp: (prop: string) => {
        return searchItems.value.find(item => item.prop === prop)
      }
    } as MaSearchExpose)

    return () => {
      if (!searchOptions.value.show) return null

      return (
        <div class="custom-search">
          <CustomForm
            ref={formRef}
            modelValue={formData.value}
            options={{
              layout: 'flex',
              flex: {
                gutter: 20
              },
              ...props.formOptions
            }}
            items={itemList}
            onUpdate:modelValue={(val: Record<string, any>) => {
              formData.value = val
            }}
          >
            {{
              footer: () => (
                <div class="custom-search__actions">
                  {slots.beforeActions?.()}
                  {slots.actions?.() || (
                    h(Fragment, null, [
                      h(ElButton, {
                        type: 'primary',
                        onClick: handleSearch
                      }, () => searchOptions.value.text?.searchBtn?.()),
                      h(ElButton, {
                        onClick: handleReset
                      }, () => searchOptions.value.text?.resetBtn?.())
                    ])
                  )}
                  {showFoldBtn.value && (
                    <ElButton type="text" onClick={handleFoldToggle}>
                      {{
                        default: () => searchOptions.value.fold
                          ? searchOptions.value.text?.isFoldBtn?.()
                          : searchOptions.value.text?.notFoldBtn?.(),
                        icon: () => searchOptions.value.fold
                          ? <ArrowDownBold /> 
                          : <ArrowUpBold />
                      }}
                    </ElButton>
                  )}
                  {slots.afterActions?.()}
                </div>
              )
            }}
          </CustomForm>
        </div>
      )
    }
  }
}) 