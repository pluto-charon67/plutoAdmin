import { MaFormOptions, MaFormItem } from '../CutsomForm/types'

// 媒体查询断点
export type MediaBreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 搜索组件配置项
export interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: Partial<Record<MediaBreakPoint, number>>
  fold?: boolean
  foldRows?: number
  show?: boolean
  text?: {
    searchBtn?: () => string
    resetBtn?: () => string
    isFoldBtn?: () => string
    notFoldBtn?: () => string
  }
}

// 搜索表单项，不继承MaFormItem以避免类型冲突
export interface MaSearchItem extends Omit<MaFormItem, 'hide'> {
  span?: number
  offset?: number
  hide?: boolean | (() => boolean)
}

// 组件暴露的方法
export interface MaSearchExpose {
  getMaFormRef: () => any
  foldToggle: () => void
  getFold: () => boolean
  setSearchForm: (form: any) => void
  getSearchForm: () => Record<string, any>
  setShowState: (show: boolean) => void
  getShowState: () => boolean
  setOptions: (options: MaSearchOptions) => void
  getOptions: () => MaSearchOptions
  setFormOptions: (options: MaFormOptions) => void
  getFormOptions: () => MaFormOptions
  setItems: (items: MaSearchItem[]) => void
  getItems: () => MaSearchItem[]
  appendItem: (item: MaSearchItem) => void
  removeItem: (prop: string) => void
  getItemByProp: (prop: string) => MaSearchItem | undefined
}

// 组件属性
export interface MaSearchProps {
  modelValue: Record<string, any>
  options?: MaSearchOptions
  formOptions?: MaFormOptions
  searchItems?: MaSearchItem[]
} 