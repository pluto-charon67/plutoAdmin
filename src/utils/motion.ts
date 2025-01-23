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
    render() {
        const { delay } = this;
        const motion = resolveDirective('motion');
        return withDirectives(h('div', {}, { default: () => [this.$slots?.default()] }), [
            [
                motion,
                {
                    initial: { opacity: 0, y: 100 },
                    enter: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            delay,
                        },
                    },
                },
            ],
        ]);
    },
});
