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
                        <el-row v-for="(item2,index) in item1.children" :key=index>
                            <el-col :span="4">
                                <el-tag type="warning" closable>{{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row,item3.id)" type="info" closable v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row v-if="scope.row.children.length===0">
                    <span>未分配权限</span>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="showEditUserDia(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showMegBoxDele(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showSetRoleDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
        <el-tree 
        ref="tree" 
        :data="treelist" 
        default-expand-all 
        show-checkbox 
        node-key="id" 
        :default-checked-keys="arrcheck"
        :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
            <el-button type="primary" @click="setRoleRight()">确 定</el-button>
        </span>
    </el-dialog>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            rolelist: [],
            dialogFormVisibleRight:false,
            treelist:[],
            arrcheck:[],
            defaultProps:{
                children:'children',
                label:'authName'
            },
            currRoleId:-1
        }
    },
    created() {
        this.getRolelist()
    },
    methods: {
        //分配权限-发送请求
        async setRoleRight(){
            let arr2=this.$refs.tree.getHalfCheckedKeys()
            // console.log(arr2)
            let arr1=this.$refs.tree.getCheckedKeys()
            // console.log(arr1)
            let arr=[...arr1,...arr2]
            // console.log(arr)
            const res=await this.$http.post(`roles/${this.currRoleId}/rights`,{
                rids: arr.join(',')
            })
            console.log(res)
            this.dialogFormVisibleRight=false
            this.getRolelist()
        },
        //分配权限-树形结构-打开对话框
        async showSetRoleDia(role){
            this.currRoleId=role.id
            const res=await this.$http.get(`rights/tree`)
            this.treelist=res.data.data
            let arrtemp=[]
            role.children.forEach(item1=>{
                item1.children.forEach(item2=>{
                    item2.children.forEach(item3=>{
                        arrtemp.push(item3.id)
                })
                })
            })
            this.arrcheck=arrtemp
            this.dialogFormVisibleRight=true
        },
        //删除当前角色的某个权限
        async deleRight(role, rightId) {
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            role.children = res.data.data
        },
        //获取角色权限数据
        async getRolelist() {
            const res = await this.$http.get(`roles`)
            this.rolelist = res.data.data
            // console.log(res)
        }
    }
}
</script>

<style>
.addRole {
    margin-top: 20px;
}
</style>
