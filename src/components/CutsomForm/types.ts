import { FormInstance, FormItemProps } from 'element-plus'
import { Component } from 'vue'

export interface LoadingConfig {
  text?: string
  spinner?: string
  svg?: string
  viewBox?: string
  background?: string
  customClass?: string
}

export interface MaFormOptions {
  containerClass?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  layout?: 'flex' | 'grid'
  grid?: {
    size?: number | [number, number]
    direction?: 'horizontal' | 'vertical'
    wrap?: boolean
  }
  flex?: {
    gutter?: number
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
    align?: 'top' | 'middle' | 'bottom'
  }
  footerSlot?: () => JSX.Element
  [key: string]: any
}

export interface MaFormItem {
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean
  show?: boolean
  cols?: {
    span?: number
    offset?: number
    pull?: number
    push?: number
  }
  itemProps?: Partial<FormItemProps>
  itemSlots?: Record<string, (...args: any[]) => JSX.Element>
  render?: string | Component | ((data: any) => JSX.Element)
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => JSX.Element>
  children?: MaFormItem[]
}

export interface MaFormExpose {
  setLoadingState: (loading: boolean) => void
  setOptions: (options: MaFormOptions) => void
  getOptions: () => MaFormOptions
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem) => void
  removeItem: (prop: string) => void
  getItemByProp: (prop: string) => MaFormItem | undefined
  isMobileState: () => boolean
  getElFormRef: () => FormInstance | undefined
}

export interface MaFormProps {
  modelValue: Record<string, any>
  options?: MaFormOptions
  items?: MaFormItem[]
} 