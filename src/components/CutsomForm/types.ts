import { FormInstance, type FormItemProps, type FormProps } from 'element-plus'
import { Component } from 'vue'

export interface LoadingConfig {
  text?: string // 文本
  spinner?: string // 加载图标
  svg?: string // svg图标
  viewBox?: string // svg视图框
  background?: string // 背景颜色
  customClass?: string // 自定义类名
}

export interface MaFormOptions extends Partial<Omit<FormProps, 'model'>> {
  containerClass?: string // 容器类名
  loading?: boolean // 是否显示加载状态
  // loadingConfig?: LoadingConfig // 加载配置
  layout?: 'flex' | 'grid' // 布局方式
  grid?: {
    size?: number | [number, number] // 栅格大小
    direction?: 'horizontal' | 'vertical' // 栅格方向
    wrap?: boolean // 是否换行
  }
  flex?: {
    gutter?: number // 间距
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' // 水平对齐方式
    align?: 'top' | 'middle' | 'bottom' // 垂直对齐方式
  }
  footerSlot?: () => JSX.Element // 底部插槽
}

export interface MaFormItem {
  label?: string | (() => string) // 标签
  prop?: string | (() => string) // 属性
  hide?: boolean // 是否隐藏
  show?: boolean // 是否显示
  cols?: {
    span?: number // 列宽
    offset?: number // 偏移量
    pull?: number // 拉取
    push?: number // 推入
  }
  itemProps?: Omit<Partial<FormItemProps>, 'label' | 'prop'> // 表单项配置
  itemSlots?: Record<string, (...args: any[]) => JSX.Element> // 表单项插槽
  render?: string | Component | ((data: any) => JSX.Element) // 渲染
  renderProps?: Record<string, any> // 渲染配置
  renderSlots?: Record<string, (...args: any[]) => JSX.Element> // 渲染插槽
  children?: MaFormItem[] // 子表单项
}

export interface MaFormExpose {
  setLoadingState: (loading: boolean) => void // 设置加载状态
  setOptions: (options: MaFormOptions) => void // 设置配置
  getOptions: () => MaFormOptions // 获取配置
  setItems: (items: MaFormItem[]) => void // 设置表单项
  getItems: () => MaFormItem[] // 获取表单项
  appendItem: (item: MaFormItem) => void // 添加表单项
  removeItem: (prop: string) => void // 删除表单项
  getItemByProp: (prop: string) => MaFormItem | undefined // 获取表单项
  isMobileState: () => boolean // 是否移动端
  getElFormRef: () => FormInstance | undefined // 获取表单实例
}

export interface MaFormProps {
  modelValue: Record<string, any> // 表单值
  options?: MaFormOptions // 配置
  items?: MaFormItem[] // 表单项
} 