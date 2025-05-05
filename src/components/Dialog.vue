<script lang="ts" setup>
import { ref,watch } from 'vue';
import { type ElDialog } from 'element-plus';

defineOptions({
    name: 'CustomDialog',
})

withDefaults(defineProps<{
    width?: string;
}>(), {
   width: '50%'
});

const emit = defineEmits<{
    (e: 'submit', value: any): void;
    (e: 'cancel', value: any): void;
}>();

// loading相关
const okLoading = ref(false);
const cancelLoading = ref(false);
const loading = ref(false);

function setOkLoading(value: boolean) {
    okLoading.value = value;
}

function setCancelLoading(value: boolean) {
    cancelLoading.value = value;
}

function setLoading(value: boolean) {
    loading.value = value;
}

const ok = () => {
    // 传递修改loading的函数
    emit('submit', { attrs, setOkLoading, setLoading });
}
const cancel = () => {
    emit('cancel', { attrs, setCancelLoading, setLoading });
    isShow.value = false;
}

const attrs = useAttrs();

const isShow = defineModel<boolean>({default: false});

</script>

<template>
  <el-dialog v-model="isShow" :draggable="true" :width="width" v-bind="$attrs">
    <template #default>
        <div v-loading="$attrs.loading ?? false">
            <slot></slot>
        </div>
    </template>
    <template #header>
        <div>
            <slot name="header">
                {{ $attrs.title ?? '' }}
            </slot>
        </div>
    </template>
    <template #footer >
        <slot name="footer">
            <div>
                <el-button :loading="cancelLoading" @click="cancel">取消</el-button>
                <el-button :loading="okLoading" type="primary" @click="ok">确定</el-button>
            </div>
        </slot>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>