import { h,ref, type Component } from 'vue';
import CutomDialog from '@/components/Dialog.vue';
import { ElDialog } from 'element-plus';

export interface UseDialogExpose {
    submit?: (...args: any[]) => void;
    cancel?: (...args: any[]) => void;
    Dialog: Component; 
    handle: {
        submit: (...args: any[]) => void;
        cancel: (...args: any[]) => void;
    },
    open: (...args: any[]) => void;
    close: (...args: any[]) => void;
    setTitle: (title: string) => void;
    setAttr: (attr: Record<string, any>) => void;
    setLoading: (loading: boolean) => void;
}

type Edit<T extends Record<string, any>> = {
    -readonly [K in keyof T]?: T[K]
}

type DialogProps = (Edit<Parameters<Exclude<(typeof ElDialog)['setup'],undefined>>[0]>) & {
    loading?: boolean;
    footer?: boolean; // 是否需要尾部区
    submit?: (...args: any[]) => void; // 尾部提交事件
    cancel?: (...args: any[]) => void; // 尾部取消事件
}

export default function useDrawer(dialogProps: DialogProps): UseDialogExpose {
    const isShow = ref(false);
    const title = ref('');
    const loading = ref(false);

    const openArgs = ref<any[]>([]);
    const closeArgs = ref<any[]>([]);
    const open = (...args: any[]) => {
        openArgs.value = args;
        isShow.value = true;
    }
    const close = () => {
        isShow.value = false;
    }

    const handle = ref<{
        submit: (...args: any[]) => void;
        cancel: (...args: any[]) => void;
    }>({
        submit: () => {},
        cancel: () => {},
    })

    const setTitle = (str: string) => title.value = str;
    const setAttr = (attr: DialogProps) => Object.assign(dialogProps, attr);
    const setLoading = (isLoading: boolean) => loading.value = isLoading;

    const Dialog = (props: DialogProps) => {
        const slots = useSlots();
        const args = Object.assign(dialogProps, props ?? {});

        // 默认插入body中
        if (args.appendToBody === undefined) {
            args.appendToBody = true;
        }

        return h(CutomDialog, {
            title: props.title ?? title.value,
            modelValue: isShow.value,
            "onUpdate:modelValue": (val: boolean) => isShow.value = val,
            footer: true, // 默认需要尾部区
            destroyOnClose: true, // 默认关闭销毁子组件
            size: '50%', // 默认宽度为50%
            ...args,
            'onCancel': ({setLoading,setCancelLoading}) => {
                // 传递loading和关闭按钮的loading修改状态的方法
                closeArgs.value.push(...[setLoading,setCancelLoading])
                return args?.submit?.(...closeArgs.value) ?? handle.value.cancel(...closeArgs.value);
            },
            'onSubmit': ({setLoading,setOkLoading}) => {
                // 传递loading和确定按钮的loading修改状态的方法
                openArgs.value.push(...[setLoading,setOkLoading])
                return args?.submit?.(...openArgs.value) ?? handle.value.submit(...openArgs.value);
            },
        }, {
            ...slots,
            default: () => slots.default?.(openArgs.value),
        });
    }

    return {
        Dialog,
        handle: handle.value,
        open,
        close,
        setTitle,
        setAttr,
        setLoading,
    }
}