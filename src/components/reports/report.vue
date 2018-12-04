
<template>
  <el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>

    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
var echarts = require("echarts");

export default {
  data() {
    return {};
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    async useEchart() {
      // getElementById() 在mounted(){}中操作

      var myChart = echarts.init(document.getElementById("main"));
      // 获取表格数据
      const res = await this.$http.get(`reports/type/1`);
      // console.log(option2);
      let option2 = res.data.data;

      // 指定图表的配置项和数据

      let option1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

      // ES6 展开运算符 ...arr ...obj
      let option = { ...option1, ...option2 };

      // reports/type/1

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
</style>
