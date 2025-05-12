<script setup lang="tsx">
import useDrawer from '@/hooks/auto-import/useDrawer';
import CustomTable from '@/components/CustomTable/index';
// import { CustomTableCloumnProps } from '@/components/Table/types';
// import Table from '@/components/Table/index';
import { VNode } from 'vue';

const activeName = ref('first');

const columns = [
{
  label: "Date",
  prop: "date",
  cellRenderer: (data): VNode => {
    console.log(data)
        return (<div style="color: red;">打撒好看</div>)
    }
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
</script>

<template>
    <div class="tags">
        <button @click="open">的</button>
        <Drawer />
        <div class="ab">
            <CustomTable :columns="columns" :data="tableData"></CustomTable>
            <br>
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
}
</style>
