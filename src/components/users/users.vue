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
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">{{scope.row.create_time |fmtdate}}</template>
        </el-table-column>

        <el-table-column label="用户状态">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>

        </el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                @click="showEditUserDia()"
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle></el-button>
                <el-button
                @click="showMegBoxDele(scope.row.id)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle></el-button>
                <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>

            </template>
        </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            userlist: [{
                create_time:'',
                email:'',
                id:'',
                mg_state:'', 
                mobile:'',
                role_name:'',
                username:''
            }],
            pagenum: 1,
            pagesize: 2,
            total: -1
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const AUTH_TOKEN = localStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(res)
            const {
                meta: {
                    msg,
                    status
                },
                data: {
                    total,
                    users
                }
            } = res.data
            if (status === 200) {
                this.total = total
                this.userlist = users
                this.$message.success(msg)
            } else {
                this.$message.warning(msg)
            }
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
