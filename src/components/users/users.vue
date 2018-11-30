<template>
  <el-card class="box-card">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->

    <my-bread level1="用户管理" level2="用户列表"></my-bread>


    <el-row class="searchRow">
      <el-col :span="16">
        <el-input
          @clear="loadUserList()"
          clearable
          v-model="query"
          placeholder="请输入用户名"
          class="searchInput"
        >
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
          <el-switch
            @change="changeUserMgstate(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showMegBoxDele(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button 
          @click="showSetRoleDia(scope.row)"
          size="mini" plain type="success" icon="el-icon-check" circle></el-button>
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
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名称" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名称" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{currUsername}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 如果 select 的v-model绑定的数据的值 -1和 option的value值 -->
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      userlist: [
        {
          create_time: "",
          email: "",
          id: "",
          mg_state: "",
          mobile: "",
          role_name: "",
          username: ""
        }
      ],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      currUsername:'',
      currRoleId:-1,
      roles:[],
      currUserId:-1
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //分配角色-发送修改请求
    async setRole(){
      const res=await this.$http.put(`users/${this.currUserId}/role`,{
        rid:this.currRoleId
      })
      const {
        meta: { status, msg }
      } = res.data;
      this.$message.success(msg)
      this.dialogFormVisibleRole=false
    },
    //分配用户角色-打开对话框
    async showSetRoleDia(user){
      this.currUserId=user.id
      this.currUsername=user.username
      const res1=await this.$http.get(`roles`)
      this.roles=res1.data.data
      const res2=await this.$http.get(`users/${user.id}`)
      this.currRoleId=res2.data.data.rid
      this.dialogFormVisibleRole=true
    },
    //修改用户状态
    async changeUserMgstate(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //编辑-发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getUserList();
      }
    },
    //编辑-显示页面
    showEditUserDia(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    //删除-打开消息提示框
    showMegBoxDele(userId) {
      this.$confirm("是否删除用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`);
        this.getUserList();
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
      });
    },
    //添加用户-发送请求
    async addUser() {
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post("users", this.form);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.getUserList();
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    //添加用户-显示对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    loadUserList() {
      this.getUserList();
    },
    //搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getUserList();
    },
    // 分页相关的方法
    // 每个条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    // 当前页码改变时 pagenum=1->2
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getUserList();
    },
    // 获取用户列表数据
    async getUserList() {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res)
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        this.total = total;
        this.userlist = users;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
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
