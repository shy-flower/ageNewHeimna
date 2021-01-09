<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- form表单区域 -->
      <el-form>
        <el-form-item label="选择商品分类">
          <!-- 下拉选择框 -->
          <el-cascader
            v-model="paramsValue"
            :options="ParamslyList"
            :props="cascaderInfo"
            @change="handleChange"
            expandTrigger="hover"
          ></el-cascader>
        </el-form-item>
        <!-- tabs 页面 -->
        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
          <!--动态参数 -->
          <el-tab-pane label="动态参数" name="first">
            <el-button type="primary" @click="addParams" size="mini"
              >添加参数</el-button
            >
            <!-- table表格 -->
            <el-table :data="manyTableList" stripe border>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index" label="#"></el-table-column>

              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                    >修改</el-button
                  >
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--静态属性 -->
          <el-tab-pane label="静态属性" name="second">
            <el-button type="primary" @click="addAttribute">
              添加属性
            </el-button>
            <!-- table表格 -->
            <el-table :data="onlyTableList" stripe border>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index" label="#"></el-table-column>

              <el-table-column prop="attr_name" label="属性名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                    >编辑</el-button
                  >
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      //级联选择器选中的id数组
      paramsValue: [],
      //级联选择器porps配置项
      cascaderInfo: {
        value: "cat_id", //匹配响应数据中的id
        label: "cat_name", //匹配响应数据中的name
        children: "children",
      },
      ParamslyList: [],
      //tabs页面默认选择
      activeName: "first",
      //动态列表数据
      manyTableList: [],
      //静态列表数据
      onlyTableList: [],
      //
      valName: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getParamslyList();
  },
  mounted() {},
  methods: {
    //当级联选择器节点发生变化时触发,返回最新节点值
    async handleChange(value) {
      this.paramsValue = value;
      if (this.paramsValue.length !== 3) {
        this.paramsValue = [];
        this.$message.error("请选择三级列表");
        return;
      }
      if (this.valName === "first") {
        //发起请求获取动态参数列表
        const { data: res } = await this.$http.get(
          `categories/${this.paramsValue[2]}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        this.manyTableList = res.data;
      }
      //发起请求获取静态属性数据列表
      const { data: res } = await this.$http.get(
        `categories/${this.paramsValue[2]}/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      this.onlyTableList = res.data;
    },
    async getParamslyList() {
      const { data: res } = await this.$http.get(`categories`);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("获取级联数据失败!");
        return;
      }
      this.ParamslyList = res.data;
      this.$message.success("获取级联数据失败!");
    },
    //tabs页面发生改变时触发,接收被选中tabs的实例
    async tabsHandleClick(val) {
      console.log(val);
      this.valName = val.name;
    },
    //添加动态参数
    addParams() {
      console.log("添加动态参数");
    },
    //添加静态属性
    addAttribute() {
      console.log("添加静态属性");
    },
  },
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 10px;
}
.el-alert {
  margin-bottom: 10px;
}
.el-table {
  margin-top: 10px;
}
</style>
