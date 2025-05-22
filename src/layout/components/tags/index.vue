<script setup lang="tsx">
import useDrawer from '@/hooks/auto-import/useDrawer';
import CustomTable from '@/components/CustomTable/index';
// import { CustomTableCloumnProps } from '@/components/Table/types';
import Table from '@/components/table/index';
import { VNode, ref, h, Fragment } from 'vue';
import CustomForm from '@/components/CutsomForm/index';
import CustomSearch from '@/components/CustomSearch/index';
import '@/components/CustomSearch/style.scss';

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
const formData = ref<{
    username: string;
    password: string;
    remember: boolean;
    type: string;
    timeRange: any[];
    activityStartTime?: string;
    activityEndTime?: string;
    [key: string]: any; // 允许添加其他动态属性
}>({
    username: '',
    password: '',
    remember: false,
    type: '1',
    timeRange: []
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
        // render: 'el-switch',
        render: () => {
            return (<el-switch />)
        },
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
    },
    {
        label: '活动时间',
        prop: 'timeRange',
        render: 'el-date-picker',
        renderProps: {
            type: 'datetimerange',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            rangeSeparator: '至'
        },
        rangeMapping: {
            startProp: 'activityStartTime',
            endProp: 'activityEndTime',
            keepArrayProp: false
        },
        cols: {
            span: 24
        }
    }
];

// 添加搜索相关的数据
const searchData = ref<{
    keyword: string;
    status: string;
    dateRange: any[];
    category: any[];
    startDate?: string;
    endDate?: string;
    [key: string]: any; // 允许添加其他动态属性
}>({
    keyword: '',
    status: '',
    dateRange: [],
    category: []
});

const searchOptions = {
    fold: true,
};

const searchItems = [
    {
        label: '关键词',
        prop: 'keyword',
        render: 'el-input',
        renderProps: {
            placeholder: '请输入关键词'
        }
    },
    {
        label: '状态',
        prop: 'status',
        render: 'el-select',
        renderProps: {
            placeholder: '请选择状态'
        },
        children: [
            {
                render: 'el-option',
                renderProps: { label: "启用", value: 1 }
            },
            {
                render: 'el-option',
                renderProps: { label: "禁用", value: 2 }
            }
        ],
    },
    {
        label: '日期范围',
        prop: 'dateRange',
        render: 'el-date-picker',
        renderProps: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'YYYY-MM-DD'
        },
        rangeMapping: {
            startProp: 'startDate',
            endProp: 'endDate'
        }
    },
    {
        label: '分类',
        prop: 'category',
        render: 'el-select',
        renderProps: {
            multiple: true,
            placeholder: '请选择分类'
        },
        children: [
            {
                render: 'el-option',
                renderProps: { label: "分类1", value: "1" }
            },
            {
                render: 'el-option',
                renderProps: { label: "分类2", value: "2" }
            },
            {
                render: 'el-option',
                renderProps: { label: "分类3", value: "3" }
            }
        ]
    }
];

// 处理搜索
const handleSearch = (data) => {
    console.log('搜索数据:', data);
    console.log('开始日期:', data.startDate);
    console.log('结束日期:', data.endDate);
    // 这里可以发起请求等操作
};

// 处理重置
const handleReset = (data) => {
    console.log('重置数据:', data);
};

// 查看表单数据
const showFormData = () => {
    console.log('表单数据:', formData.value);
    // 检查映射后的字段
    console.log('活动开始时间:', formData.value.activityStartTime);
    console.log('活动结束时间:', formData.value.activityEndTime);
    // 由于keepArrayProp设为true，原数组也会保留
    console.log('原时间范围数组:', formData.value.timeRange);
};

// 模拟从API获取数据初始化表单
const mockInitFormData = () => {
    // 假设这是从API获取的数据，只有开始和结束时间，没有数组
    const apiData = {
        username: 'admin',
        password: '123456',
        remember: true,
        type: '2',
        activityStartTime: '2023-12-01 09:00:00',
        activityEndTime: '2023-12-31 18:00:00',
        timeRange: [] // 添加空数组，会被组件自动填充
    };
    
    // 更新表单数据
    formData.value = apiData;
    
    // CustomForm组件会自动从activityStartTime和activityEndTime字段重建timeRange数组
    // 无需手动处理，这是rangeMapping功能的优点
    
    console.log('表单已初始化');
};
</script>

<template>
    <div class="tags">
        <button @click="open">的</button>
        <Drawer />
        <div class="ab">
            <!-- 搜索组件示例 -->
            <div class="search-container">
                <h3>搜索组件示例</h3>
                <CustomSearch
                    :options="searchOptions"
                    :searchItems="searchItems"
                    @search="handleSearch"
                    @reset="handleReset"
                />
            </div>

            <!-- 表单组件示例 -->
            <h3>表单组件示例</h3>
            <CustomForm
                v-model="formData"
                :options="formOptions"
                :items="formItems"
            />
            <div style="margin-top: 16px;">
                <el-button type="primary" @click="showFormData">查看表单数据</el-button>
                <el-button type="success" @click="mockInitFormData">模拟API初始化</el-button>
            </div>
            
            <h3>表格组件示例</h3>
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
    
    .search-container {
        margin-bottom: 20px;
    }
    
    h3 {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 500;
    }
}
</style>
