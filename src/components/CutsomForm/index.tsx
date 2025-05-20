import { defineComponent, ref, PropType, computed } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElSpace, ElLoadingDirective } from 'element-plus'
import { MaFormProps, MaFormOptions, MaFormItem, MaFormExpose } from './types'
import { resolveComponent, h, VNode, Component, isVNode } from 'vue'
import { isFunction, isString } from '@/utils/typeUtils'

export default defineComponent({
  name: 'CustomForm',
  directives: {
    Loading: ElLoadingDirective
  },
  props: {
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      required: true
    },
    options: {
      type: Object as PropType<MaFormOptions>,
      default: () => ({})
    },
    items: {
      type: Array as PropType<MaFormItem[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose, slots }) {
    const formRef = ref<InstanceType<typeof ElForm>>()
    const formOptions = ref<MaFormOptions>(props.options)
    const formItems = ref<MaFormItem[]>(props.items)

    // 判断是否为渲染函数
    const isRenderFunction = (value: unknown): value is (data: any) => VNode => {
      return isFunction(value) && !('props' in value) && !('setup' in value) && !('render' in value)
    }

    // 移动端状态检测
    const isMobileState = () => {
      return window.innerWidth <= 768
    }

    // 渲染表单项
    const renderFormItem = (item: MaFormItem) => {
      if (item.hide || item.show === false) return null

      const label = typeof item.label === 'function' ? item.label() : item.label
      const prop = typeof item.prop === 'function' ? item.prop() : item.prop

      // 处理渲染组件
      const renderComponent = () => {
        if (!item.render) return null

        // 构建通用的props，用于自动进行数据
        const commonProps = prop ? {
          modelValue: props.modelValue[prop],
          'onUpdate:modelValue': (val: any) => {
            emit('update:modelValue', { ...props.modelValue, [prop]: val })
          }
        } : {}

        // 处理子节点
        const renderChildren = () => {
          console.log('renderChildren', item.children)
          if (!item.children || item.children.length === 0) return null
          return item.children.map(child => {
            if (child.render) {
              if (isRenderFunction(child.render)) {
                return child.render(props.modelValue)
              } else if (isString(child.render)) {
                const ChildComp = resolveComponent(child.render)
                return h(ChildComp, { ...child.renderProps })
              } else {
                return h(child.render as Component, { ...child.renderProps })
              }
            }
            return null
          })
        }

        if (isString(item.render)) {
          const Component = resolveComponent(item.render)
          return h(Component, {
            ...commonProps,
            ...item.renderProps,
          }, { default: () => renderChildren() })
        }

        // 处理渲染函数
        if (isRenderFunction(item.render)) {
          const vnode = item.render(props.modelValue)
          // 如果返回的是组件VNode且有prop，我们需要合并props,并添加可能存在的子组件
          // 渲染函数自身的props优先级要比通用的高
          if (prop && isVNode(vnode) && typeof vnode.type === 'object') {
            // 直接返回vnode，保留原始的children子节点
            return h(vnode.type as Component, {
              ...commonProps,
              ...vnode.props,
            }, vnode.children || { default: () => renderChildren() })  // 如果是组件VNode，则直接返回vnode，保留原始的children子节点，否则使用renderChildren，兼容jsx子节点和children对象的渲染
          }
          return vnode
        }

        // 处理组件对象
        return h(item.render as Component, {
          ...commonProps,
          ...item.renderProps,
        }, { default: () => renderChildren() })
      }

      const formItemContent = (
        <ElFormItem
          label={label}
          prop={prop}
          {...item.itemProps}
          v-slots={item.itemSlots}
        >
          {renderComponent()}
        </ElFormItem>
      )

      // 处理列布局
      if (formOptions.value.layout === 'flex' && item.cols) {
        return (
          <ElCol {...item.cols}>
            {formItemContent}
          </ElCol>
        )
      }

      return formItemContent
    }

    // 渲染表单内容
    const renderFormContent = () => {
      if (slots.default) {
        return slots.default()
      }

      if (formOptions.value.layout === 'flex') {
        return (
          <ElRow {...formOptions.value.flex}>
            {formItems.value.map(item => renderFormItem(item))}
          </ElRow>
        )
      }

      if (formOptions.value.layout === 'grid') {
        return (
          <ElSpace {...formOptions.value.grid}>
            {formItems.value.map(item => renderFormItem(item))}
          </ElSpace>
        )
      }

      return formItems.value.map(item => renderFormItem(item))
    }

    // 暴露方法
    expose({
      setLoadingState: (loading: boolean) => {
        formOptions.value.loading = loading
      },
      setOptions: (options: MaFormOptions) => {
        formOptions.value = options
      },
      getOptions: () => formOptions.value,
      setItems: (items: MaFormItem[]) => {
        formItems.value = items
      },
      getItems: () => formItems.value,
      appendItem: (item: MaFormItem) => {
        formItems.value.push(item)
      },
      removeItem: (prop: string) => {
        const index = formItems.value.findIndex(item => item.prop === prop)
        if (index > -1) {
          formItems.value.splice(index, 1)
        }
      },
      getItemByProp: (prop: string) => {
        return formItems.value.find(item => item.prop === prop)
      },
      isMobileState,
      getElFormRef: () => formRef.value
    } as MaFormExpose)

    return () => {
      const containerClass = computed(() => ({
        'custom-form': true,
        [formOptions.value.containerClass || '']: !!formOptions.value.containerClass
      }))

      return (
        <ElForm
          ref={formRef}
          class={containerClass.value}
          model={props.modelValue}
          {...formOptions.value}
          v-loading={formOptions.value.loading}
          element-loading-text={formOptions.value.loadingConfig?.text}
          element-loading-spinner={formOptions.value.loadingConfig?.spinner}
          element-loading-svg={formOptions.value.loadingConfig?.svg}
          element-loading-view-box={formOptions.value.loadingConfig?.viewBox}
          element-loading-background={formOptions.value.loadingConfig?.background}
          element-loading-custom-class={formOptions.value.loadingConfig?.customClass}
        >
          {renderFormContent()}
          {slots.footer?.() || formOptions.value.footerSlot?.()}
        </ElForm>
      )
    }
  }
})
