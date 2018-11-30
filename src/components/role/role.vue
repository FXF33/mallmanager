<template>
<el-card>
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addRole">
        <el-col>
            <el-button>添加角色</el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="rolelist" height="450px" style="width: 100%">
        <el-table-column type="expand" width="80">
            <template slot-scope="scope">
                <el-row v-for="(item1,index) in scope.row.children" :key="index">
                    <el-col :span="4">
                        <el-tag type="success" closable @close="deleRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-tag closable>

                        </el-tag>
                    </el-col>
                </el-row>

                <el-row v-if="scope.row.children.length===0">
                    <span>未分配权限</span>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="showEditUserDia(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showMegBoxDele(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showSetRoleDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            rolelist: []
        }
    },
    created() {
        this.getRolelist()
    },
    methods: {
        async getRolelist() {
            const res = await this.$http.get(`roles`)
            this.rolelist = res.data.data
            console.log(res)
        }
    }
}
</script>

<style>
.addRole {
    margin-top: 20px;
}
</style>
