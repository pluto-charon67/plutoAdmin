import { h, defineComponent } from 'vue';
// 从离线版本导入 Icon 组件和 addIcon 函数，避免网络请求
import { Icon as OfflineIcon, addIcon, type IconifyIcon } from '@iconify/vue/dist/offline';
import { isNil,isString,isObject } from '@/utils/typeUtils';

// @iconify/vue中下载的本地图标，无需网络加载
export default defineComponent({
    name: 'LocalIcon',
    components: {
        OfflineIcon,
    },
    props: {
        icon: {
            default: null,
        },
    },
    render() {
        const icon = this.icon;
        console.log(icon, OfflineIcon, '-===');
        
        // 检查图标是否为空，如果为空则输出警告并返回null
        if (isNil(icon)) {
            console.warn('icon is required');
            return null;
        }
        
        // 如果传入的是字符串类型的图标名称
        if (isString(icon)) {
            // 直接渲染 OfflineIcon 组件，传入图标名称和其他属性
            return h(OfflineIcon, 
                { 
                    icon: this.icon,
                    'aria-hidden': 'false',
                    ...(this.$attrs ?? {}),
                    style: this.$attrs?.style ? Object.assign(this.$attrs.style, { outline: 'none' }) : { outline: 'none' },
                },
            );
        }
        
        // 如果传入的是对象类型的图标数据
        if (isObject(icon)) {
            // 生成默认的图标名称，如果图标对象没有名称属性
            const defaultName = `custom:${Math.random().toString(36).substr(2, 9)}`;
            // 使用 addIcon 函数将图标数据注册到 Iconify 的本地存储中
            // 这样图标就可以通过名称被引用，无需网络加载
            addIcon(icon?.name || defaultName, icon as IconifyIcon);
        }
        
        // 直接渲染传入的图标组件（当 icon 既不是字符串也不是对象时）
        return h(icon, {
            'aria-hidden': 'false',
            ...(this.$attrs ?? {}),
            style: this.$attrs?.style ? Object.assign(this.$attrs.style, { outline: 'none' }) : { outline: 'none' },
        });
    },
});