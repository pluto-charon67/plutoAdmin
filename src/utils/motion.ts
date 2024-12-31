// h-创建虚拟dom defineComponent-定义vue组件 withDirectives-应用指令 resolveDirective-解析指令
import { h, defineComponent, withDirectives, resolveDirective } from 'vue';

// 封装@vueuse/motion指令的动画组件
export default defineComponent({
    name: 'Motion',
    props: {
        delay: {
            type: Number,
            default: 50,
        },
    },
});
