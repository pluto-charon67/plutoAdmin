import {
    ElMessage,
    type MessageOptionsWithType,
    ElMessageBox,
    type ElMessageBoxOptions,
    type MessageBoxData,
    ElNotification,
    type NotificationOptions,
} from 'element-plus';

// 消息框默认配置
const defaultMessageOptions = {
    duration: 1000, // 默认的消息显示时间
    showClose: true, // 消息是否可以被手动关闭
};

// 弹出框默认配置
const defaultMessageBoxOptions = {
    title: '提示',
    showClose: true, // 是否显示右上角的关闭按钮
    lockScroll: true, // 弹出时，锁定body的滚动
    draggable: true, // 是否可以拖放
    confirmButtonText: '确定',
};

// 消息通知默认配置
const defaultNotificationOptions = {
    duration: 4500, // 默认的消息显示时间
    showClose: true, // 消息是否可以被手动关闭
};

// 合并配置，覆盖默认配置，返回新的配置
function mergeOptions<T>(defaultOptions, options: T): T {
    const currentOptions: T = { ...defaultOptions };
    Object.assign(currentOptions, options);
    return currentOptions;
}

function useMessage() {
    return {
        info(content: string, options: MessageOptionsWithType = {}) {
            const res = mergeOptions<MessageOptionsWithType>(defaultMessageOptions, options);
            ElMessage({
                type: 'info',
                message: content,
                ...res,
            });
        },
        success(content: string, options: MessageOptionsWithType = {}) {
            const res = mergeOptions<MessageOptionsWithType>(defaultMessageOptions, options);
            ElMessage({
                type: 'success',
                message: content,
                ...res,
            });
        },
        warn(content: string, options: MessageOptionsWithType = {}) {
            const res = mergeOptions<MessageOptionsWithType>(defaultMessageOptions, options);
            ElMessage({
                type: 'warning',
                message: content,
                ...res,
            });
        },
        error(content: string, options: MessageOptionsWithType = {}) {
            const res = mergeOptions<MessageOptionsWithType>(defaultMessageOptions, options);
            ElMessage({
                type: 'error',
                message: content,
                ...res,
            });
        },
        // 弹出式-非确认
        alert(content: string, options: ElMessageBoxOptions) {
            const res = mergeOptions<ElMessageBoxOptions>(defaultMessageBoxOptions, {});
            ElMessageBox.alert(content, {
                ...res,
            });
        },
        alertSuccess(content: string, options: ElMessageBoxOptions) {
            const res = mergeOptions<ElMessageBoxOptions>(defaultMessageBoxOptions, options);
            ElMessageBox.alert(content, {
                ...res,
                type: 'success',
            });
        },
        alertError(content: string, options: ElMessageBoxOptions) {
            const res = mergeOptions<ElMessageBoxOptions>(defaultMessageBoxOptions, options);
            ElMessageBox.alert(content, {
                ...res,
                type: 'error',
            });
        },
        alertWarn(content: string, options: ElMessageBoxOptions) {
            const res = mergeOptions<ElMessageBoxOptions>(defaultMessageBoxOptions, options);
            ElMessageBox.alert(content, {
                ...res,
                type: 'warning',
            });
        },
        // 提交内容
        prompt(content: string, options: ElMessageBoxOptions): Promise<MessageBoxData> {
            return ElMessageBox.prompt(content, options);
        },
        // 确认式弹窗
        confirm(content: string, options: ElMessageBoxOptions): Promise<MessageBoxData> {
            const res = mergeOptions<ElMessageBoxOptions>(defaultMessageBoxOptions, options);
            return ElMessageBox.confirm(content, {
                type: 'warning',
                cancelButtonText: '取消',
                ...res,
            });
        },
        // 消息通知类
        notify(content: string, options: NotificationOptions) {
            const res = mergeOptions<NotificationOptions>(defaultNotificationOptions, options);
            ElNotification({
                title: '提示',
                message: content,
                ...res,
            });
        },
        notifySuccess(content: string, options: NotificationOptions) {
            const res = mergeOptions<NotificationOptions>(defaultNotificationOptions, options);
            ElNotification({
                title: '提示',
                message: content,
                ...res,
                type: 'success',
            });
        },
        notifyError(content: string, options: NotificationOptions) {
            const res = mergeOptions<NotificationOptions>(defaultNotificationOptions, options);
            ElNotification({
                title: '提示',
                message: content,
                ...res,
                type: 'error',
            });
        },
    };
}

export default useMessage;
