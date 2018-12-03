<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2. 提示消息 -->
    <el-alert class="alert" center title="添加商品信息" type="success" show-icon></el-alert>

    <!-- 3. 步骤条(进度条)
      基本信息
      商品参数
      商品属性
      商品图片
      商品内容
    -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 4. tabs标签页
    value -> el-tabs表单元素 -> v-model绑定
    -->
    <!-- {{active}} -->
    <!-- 添加商品 -> 发送添加请求 -> 携带商品数据 -->
    <el-form
      :model="form"
      label-position="top"
      label-width="80px"
      style="height:350px;overflow:auto;"
    >
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器
            options->数据源list
            v-model->[label对应的value值]
            @change->选项发生改变 就会触发
            props->配置选项 {label:来源于list数组中label值对应的key名,value,children}
          -->
          <el-form-item label="商品分类">
            {{selectedOptions}}
            <el-cascader
              expand-trigger="hover"
              :options="options"
              :props="defaultProps"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 点击第二个tab 获取商品参数数据-->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">
            {{item1.attr_vals}}
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- checkbox -->
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- el-upload
          action 可以发请求 而且不是axios发的请求 不是ajax请求
          头部需要重新设置
          请求标识要写全路径
          -->
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGood()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '1',
            // form中的key名要查接口文档-添加商品-
            // goods_cat	以为','分割的分类列表	不能为空
            // goods_name	商品名称	不能为空
            // goods_price	价格	不能为空
            // goods_weight	重量	不能为空
            // goods_number	数量	不能为空
            // goods_introduce	介绍	可以为空
            // pics	上传的图片临时路径（对象）	可以为空
            // attrs	商品的参数（数组）	可以为空
            form: {
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_number: '',
                goods_introduce: '', // 介绍

                // 第一个tab - 基本信息 - 级联选择器 v-model所绑定的数据
                goods_cat: '', // 以为','分割的分类列表	不能为空
                // pic:[] [每个图片临时路径的对象 {pic:临时路径}]
                pics: [], // 上传的图片临时路径（对象）	可以为空
                // 动态参数+静态参数的部分数据
                attrs: '' //商品的参数（数组）	可以为空

            },
            // 三级分类的数据
            options: [],
            // 级联选择器v-model绑定的数据
            selectedOptions: [1, 3, 6],
            // porps属性的值
            defaultProps: {
                // 分类id
                value: 'cat_id',
                // 是分类名称
                label: 'cat_name',
                // 下一级别数据的key
                children: 'children'
            },
            // 动态参数的数据
            arrDyparams: [],
            // 静态参数的数据
            arrStaticparams: [],
            // 图片上传
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    },
    created() {
        this.getGoodsCateList()
    },
    methods: {
        // 添加商品 - 发送post请求

        async addGood() {
            // 第一个tab - 基本信息 - 级联选择器 v-model所绑定的数据
            // 以为','分割的分类列表	不能为空
            // this.form.goods_cat: '',
            // pic:[] [每个图片临时路径的对象 {pic:临时路径}]
            // 上传的图片临时路径（对象）	可以为空
            //  this.form.pics: [],
            // 动态参数+静态参数的部分数据
            //商品的参数（数组）	可以为空
            //  this.form.attrs: ''


            // 1. goods.cat
            this.form.goods_cat = this.selectedOptions.join(",")
            // 2. pics -> 图片上传时的成功和移除的函数中进行处理

            let arr1=this.arrDyparams.map(item=>{
              return {attr_id:item.attr_id,attr_value:item.attr_vals}
            })
            let arr2=this.arrStaticparams.map(item=>{
              return {attr_id:item.attr_id,attr_value:item.attr_vals}
            })
            let attrs=[...arr1,...arr2]
            this.form.attrs=attrs

            const res = await this.$http.post(`goods`, this.form)
            // console.log(res)
            this.$router.push({name:'goods'})

        },
        // 图片上传
        handleRemove(file, fileList) {
            console.log(file, fileList)
            // file形参中有该图片的信息 ,比如临时路径tmp_path
            // file.response.data.tmp_path
              // 从this.form.pics数组中移除该图
              // 三个图片 A B C
              // X-> B
              // this.form.pics
              // findIndex 能遍历并且 返回符合条件的元素的索引

              let Index = this.form.pics.findIndex((item)=>{
                  return item.pic === file.response.data.tmp_path
              }) 

              console.log(Index)

              this.form.pics.splice(Index,1)
              console.log(this.form.pics)


        },
        handlePreview(file) {
            console.log(file);
        },
        handleSuccess(file) {
            console.log(file)
            // file.data.tmp_path
            this.form.pics.push({
              pic:file.data.tmp_path
            })
        },
        // tab切换时的方法
        async tabChange() {
            if (this.selectedOptions.length !== 3) {
                this.$message.warning('请先选择三级分类')
                return
            }

            if (this.active === '2') {
                // 发送请求 获取动态参数的数据
                // id 是该商品的第三级分类的id ->  selectedOptions[2]
                const res =
                    await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                // console.log(res)
                this.arrDyparams = res.data.data

                // this.arrDyparams 每个对象中的attr_vals字符串  -> 数组
                this.arrDyparams.forEach((item) => {

                    item.attr_vals =
                        item.attr_vals.trim().length === 0 ?
                        [] : item.attr_vals.trim().split(',')

                    // item.attr_vals = item.attr_vals.trim().split(',')
                })
            } else if (this.active === '3') {
                // 获取静态参数的数据
                // categories/:id/attributes
                const res =
                    await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                console.log(res)
                this.arrStaticparams = res.data.data

            }
        },
        handleChange() {},

        // 获取三级分类的商品数据
        async getGoodsCateList() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            this.options = res.data.data
        }
    }
}
</script>

<style>
.alert {
    margin-top: 20px;
}

.ql-editor {
    min-height: 300px;
}
</style>
