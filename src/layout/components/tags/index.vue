<script setup lang="ts">
const activeName = ref('first');
</script>

<template>
    <div class="tags">
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
                }
            }
        }
    }
}
</style>
