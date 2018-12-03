<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>
    <!-- 级联选择器 -->
    <el-form label-width="80px" class="formcas">
      <el-form-item label="商品分类">
        {{selectedOptions}}
        <el-cascader
          clearable
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="danger">设置静态参数</el-button>
        <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      // 三级分类的数据
      options: [],
      // 级联选择器v-model绑定的数据
      selectedOptions: [1, 3, 6],
      // porps属性的值
      defaultProps: {
        // 分类id
        value: "cat_id",
        // 是分类名称
        label: "cat_name",
        // 下一级别数据的key
        children: "children"
      },
      arrDyparams: [],
      inputVisible: false,
      inputValue: "",
      arrStaticparams: []
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    async handleClose(attr, tag) {
      // console.log(attr);

      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
      // 发送请求
      // categories/:id/attributes/:attrid
      console.log(attr.attr_id);

      const res = await this.$http.delete(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`
      );
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        // 发送请求
        // categories/:id/attributes
        // attr_name	参数名称	不能为空
        // attr_sel	[only,many]	不能为空
        // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔

        const res = await this.$http.post(
          `categories/${this.selectedOptions[2]}/attributes`,
          {
            attr_name: attr.attr_name,
            attr_sel: "many",
            attr_vals: attr.attr_vals.join(",")
          }
        );
        console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // tab切换时
    async handleClick() {
      //
      if (this.active === "2") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          this.arrStaticparams = res.data.data;
        }
      }
    },
    // 获取当前三级分类的动态参数
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        // 获取动态参数数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res)
        this.arrDyparams = res.data.data;
        console.log(this.arrDyparams);
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.trim().length === 0
              ? []
              : item.attr_vals.trim().split(",");

          // item.attr_vals = item.attr_vals.trim().split(',')
        });
      }
    },
    // 获取三级分类的商品数据
    async getGoodsCateList() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res)
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}
.formcas {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
