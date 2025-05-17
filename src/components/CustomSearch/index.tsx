import { defineComponent, ref, PropType, computed, Fragment, h } from 'vue'
import { ElButton, ElRow, ElCol } from 'element-plus'
import { MaSearchProps, MaSearchOptions, MaSearchItem, MaSearchExpose } from './types'
import { MaFormOptions } from '../CutsomForm/types'
import CustomForm from '../CutsomForm'

export default defineComponent({
  name: 'CustomSearch',
  props: {
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      required: true
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
  emits: ['update:modelValue', 'search', 'reset', 'fold'],
  setup(props, { emit, expose, slots }) {
    const formRef = ref()
    const searchOptions = ref<MaSearchOptions>({
      fold: false,
      foldRows: 2,
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

    // 计算实际显示的表单项
    const visibleItems = computed(() => {
      return searchItems.value.filter(item => {
        if (typeof item.hide === 'function') {
          return !item.hide()
        }
        return !item.hide
      })
    })

    // 计算当前显示的列数
    const currentCols = computed(() => {
      const width = window.innerWidth
      const { cols = {} } = searchOptions.value
      if (width < 768) return cols.xs || 1
      if (width < 992) return cols.sm || 2
      if (width < 1200) return cols.md || 2
      if (width < 1920) return cols.lg || 3
      return cols.xl || 4
    })

    // 计算是否需要显示折叠按钮
    const showFoldBtn = computed(() => {
      const { foldRows = 2 } = searchOptions.value
      return visibleItems.value.length > foldRows * (currentCols.value || 1)
    })

    // 计算显示的表单项 - 将内联计算改为响应式计算属性
    const displayItems = computed(() => {
      return searchOptions.value.fold
        ? visibleItems.value.slice(0, searchOptions.value.foldRows * currentCols.value)
        : visibleItems.value
    })

    // 处理搜索
    const handleSearch = () => {
      emit('search', props.modelValue)
    }

    // 处理重置
    const handleReset = () => {
      const defaultValue = searchOptions.value.defaultValue || {}
      emit('update:modelValue', { ...defaultValue })
      emit('reset', defaultValue)
    }

    // 处理折叠切换
    const handleFoldToggle = () => {
      searchOptions.value.fold = !searchOptions.value.fold
      emit('fold', searchOptions.value.fold)
    }

    // 暴露方法
    expose({
      getMaFormRef: () => formRef.value,
      foldToggle: handleFoldToggle,
      getFold: () => searchOptions.value.fold,
      setSearchForm: (form: any) => {
        emit('update:modelValue', { ...form })
      },
      getSearchForm: () => props.modelValue,
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
      },
      getItems: () => searchItems.value,
      appendItem: (item: MaSearchItem) => {
        searchItems.value.push(item)
      },
      removeItem: (prop: string) => {
        const index = searchItems.value.findIndex(item => item.prop === prop)
        if (index > -1) {
          searchItems.value.splice(index, 1)
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
            modelValue={props.modelValue}
            options={{
              layout: 'flex',
              flex: {
                gutter: 20
              },
              ...props.formOptions
            }}
            items={displayItems.value.map(item => ({
              ...item,
              cols: {
                span: 24 / currentCols.value,
                ...item.cols
              }
            }))}
            onUpdate:modelValue={(val: any) => emit('update:modelValue', val)}
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
                    <ElButton link type="primary" onClick={handleFoldToggle}>
                      {searchOptions.value.fold
                        ? searchOptions.value.text?.isFoldBtn?.()
                        : searchOptions.value.text?.notFoldBtn?.()}
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