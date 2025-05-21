import { MaFormOptions, MaFormItem } from '../CutsomForm/types'

// 媒体查询断点, 默认支持5个断点,每个断点显示多少列
export type MediaBreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 搜索组件配置项
export interface MaSearchOptions {
  defaultValue?: Record<string, any> // 默认值
  cols?: Partial<Record<MediaBreakPoint, number>> // 媒体查询断点, 默认支持5个断点,每个断点显示多少列
  fold?: boolean // 是否折叠
  foldRows?: number // 折叠行数
  show?: boolean // 是否显示
  text?: {
    searchBtn?: () => string // 搜索按钮文本
    resetBtn?: () => string // 重置按钮文本
    isFoldBtn?: () => string // 展开按钮文本
    notFoldBtn?: () => string // 折叠按钮文本
  }
}

// 搜索表单项，不继承MaFormItem以避免类型冲突
export interface MaSearchItem extends Omit<MaFormItem, 'hide' | 'prop'> {
  span?: number // 列宽
  offset?: number // 偏移量
  hide?: boolean | (() => boolean) // 是否隐藏
  prop: string  // 修改为必须是字符串
}

// 组件暴露的方法
export interface MaSearchExpose {
  getMaFormRef: () => any // 获取表单实例
  foldToggle: () => void // 折叠切换
  getFold: () => boolean // 获取折叠状态
  setSearchForm: (form: Record<string, any>) => void // 设置搜索表单
  getSearchForm: () => Record<string, any> // 获取搜索表单
  setShowState: (show: boolean) => void // 设置显示状态
  getShowState: () => boolean // 获取显示状态
  setOptions: (options: MaSearchOptions) => void // 设置配置项
  getOptions: () => MaSearchOptions // 获取配置项
  setFormOptions: (options: MaFormOptions) => void // 设置表单配置项
  getFormOptions: () => MaFormOptions // 获取表单配置项
  setItems: (items: MaSearchItem[]) => void // 设置表单项
  getItems: () => MaSearchItem[] // 获取表单项
  appendItem: (item: MaSearchItem) => void // 添加表单项
  removeItem: (prop: string) => void // 删除表单项
  getItemByProp: (prop: string) => MaSearchItem | undefined // 获取表单项
}

// 组件属性
export interface MaSearchProps {
  modelValue?: Record<string, any>  // 改为可选
  defaultValue?: Record<string, any>  // 添加默认值属性
  options?: MaSearchOptions // 配置项
  formOptions?: MaFormOptions // 表单配置项
  searchItems?: MaSearchItem[] // 搜索表单项
} 