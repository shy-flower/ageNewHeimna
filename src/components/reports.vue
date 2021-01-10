<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  1. 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 750px;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash"; //使用lodash的merge函数合并2个对象
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      //为了有鼠标跟随效果,需要激昂options数据与服务器返回的data数据做合并
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
    // 2.  使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {
    // 此时页面上的元素已经渲染完成
    // 基于准备好的dom，初始化echarts实例
    // 3.
    var myChart = echarts.init(document.getElementById("main"));

    //发起请求获取折线图数据
    const { data: res } = await this.$http.get(`reports/type/1`);
    console.log(res);
    if (res.meta.status !== 200) {
      this.$message.error("获取折线图数据失败!");
      return;
    }
    //准备数据和配置项
    const result = _.merge(res.data, this.options);

    //  5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {},
};
</script>

<style scoped lang="less"></style>
