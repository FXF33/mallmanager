<template>
<el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="searchRow">
        <el-col :span="16">
            <el-input @clear="loadUserList()" clearable v-model="query" placeholder="请输入用户名" class="searchInput">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
        </el-col>
    </el-row>

    <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            userlist: [{
                username: '111',
                email: '',
                mobile: ''
            }]
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.searchRow {
    margin-top: 20px;
}

.searchInput {
    width: 300px;
}
</style>
