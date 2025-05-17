<script setup lang="tsx">
import useDrawer from '@/hooks/auto-import/useDrawer';
import CustomTable from '@/components/CustomTable/index';
// import { CustomTableCloumnProps } from '@/components/Table/types';
import Table from '@/components/Table/index';
import { VNode, Fragment } from 'vue';
import CustomForm from '@/components/CutsomForm/index';

const activeName = ref('first');

const columns = [
    {
        label: "Date",
        prop: "date",
        cellRenderer: ({row}): VNode => {
            return <div style="color: red;">{row.date}是</div>
        },
    }, {
        label: "Name",
        prop: "name",
    }, {
        label: "Address",
        prop: "address",
    }
]

const tableData = [
    {
        date: '2030-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2030-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2030-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2030-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]

const {
    Drawer,
    open
} = useDrawer({
    title: '详情'
});

// 添加表单相关的数据
const formData = ref({
    username: '',
    password: '',
    remember: false,
    type: '1'
});

const formOptions = {
    labelWidth: '120px',
    layout: 'flex' as const,
    flex: {
        gutter: 20
    }
};

const formItems = [
    {
        label: '用户名',
        prop: 'username',
        render: 'el-input',
        renderProps: {
            placeholder: '请输入用户名'
        },
        cols: {
            span: 12
        }
    },
    {
        label: '密码',
        prop: 'password',
        render: 'el-input',
        renderProps: {
            type: 'password',
            placeholder: '请输入密码'
        },
        cols: {
            span: 12
        }
    },
    {
        label: '记住我',
        prop: 'remember',
        render: 'el-switch',
        cols: {
            span: 12
        }
    },
    {
        label: '用户类型',
        prop: 'type',
        render: (data) => {
            console.log(data);
            return (<el-select 
                placeholder="请选择用户类型"
            >
                <el-option label="管理员" value="1" />
                <el-option label="普通用户" value="2" />
            </el-select>)
        },
        cols: {
            span: 12
        }
    }
];
</script>

<template>
    <div class="tags">
        <button @click="open">的</button>
        <Drawer />
        <div class="ab">
            <CustomForm
                v-model="formData"
                :options="formOptions"
                :items="formItems"
            />
            <CustomTable :columns="columns" :data="tableData"></CustomTable>
            <!-- <Table :columns="columns" :data="tableData"></Table> -->
        </div>
        <el-tabs :closable="true" v-model="activeName">
            <el-tab-pane label="User" name="first">User</el-tab-pane>
            <el-tab-pane label="Config" name="second">Config</el-tab-pane>
            <el-tab-pane label="Role" name="third">Role</el-tab-pane>
            <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.tags {
    :deep(.el-tabs) {
        .el-tabs__header {
            margin: 0;

            .el-tabs__nav-wrap {
                &::after {
                    display: none;
                }

                .el-tabs__item {
                    padding: 0 6px;

                    .is-icon-close {
                        width: 0;
                        transition: all 0.2s;
                    }

                    &:hover .is-icon-close {
                        width: 1em;
                    }

                    &.is-active {
                        box-shadow: 0 0 0.7px #888;
                    }
                }
            }
        }
    }
    :deep(.custom-form) {
        padding: 20px;
        background: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
    }
}
</style>
