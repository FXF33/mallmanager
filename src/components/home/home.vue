<template>
<el-container class="container">
    <el-header class="header">
        <el-row class="header-row">
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img class="logo" src="../../assets/logo.png" alt="该图片无法显示">
          </div>
            </el-col>
            <el-col :span="19" class="middle">
                <div class="grid-content bg-purple-light">
                    <h3>电商后台管理系统</h3>
                </div>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <el-button type="text" class="loginout" @click.prevent="handleloginout()">退出</el-button>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside class="aside" width="200px">
            <!-- 开启路由模式 -->
            <el-menu :router="true" :unique-opened="true" class="el-menu-vertical-demo">
                
                <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="i">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                    </template>
                    <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
                        <template slot="title">
                            <i class="el-icon-sort"></i>
                            <span>{{item2.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data(){
        return{
            menus:[]
        }
    },
    beforeCreate() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push({
                name: "login"
            });
        }
    },
    created(){
        this.getMenus()
    },
    methods: {
        async getMenus(){
            const res=await this.$http.get(`menus`)
            // console.log(res)
            this.menus=res.data.data
        },
        handleloginout() {
            this.$message.success("退出成功");
            localStorage.clear();
            this.$router.push({
                name: "login"
            });
        }
    }
};
</script>

<style>
.container {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
    height: 100%;
}

/* 头部样式调整 */
.middle {
    text-align: center;
}

.loginout {
    line-height: 30px;
    font-size: 16px;
    /* text-decoration: none; */
}
</style>
