<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-input
        placeholder="请输入内容"
        v-model="info.query"
        class="input-with-select"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="orderSearch"
        ></el-button>
      </el-input>
      <!-- 表单区域 -->
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay == '1'">已付款</el-tag>
            <el-tag v-else-if="scope.row.order_pay == '0'" type="danger"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | time }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="modifyAddress"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location-information
"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="info.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="info.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialog" width="30%">
      <el-form
        :model="modifyAddressInfo"
        :rules="modifyRules"
        ref="modifyRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="name">
          <el-cascader
            expand-trigger="hover"
            :options="citydata"
            :props="citydataProps"
            v-model="cityModel"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="消息地址" prop="Address">
          <el-input v-model="modifyAddressInfo.Address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialog = false">取 消</el-button>
        <el-button type="primary" @click="addressDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/router/citydata.js";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      //订单地址数据
      citydata,
      //order订单数据
      orderList: [],
      info: {
        query: "", //搜索框输入的信息
        pagenum: 1,
        pagesize: 5,
      },
      total: 1,
      //修改地址对话框
      addressDialog: false,
      modifyAddressInfo: {
        Address: "",
      },
      //修改地址的验证规则
      modifyRules: {
        Address: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      citydataProps: {
        label: "label",
        children: "children",
      },
      //修改地址选中的id数组
      cityModel: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getOrderList();
  },
  mounted() {},
  methods: {
    //搜索信息
    orderSearch() {
      console.log(this.info.query);
      this.getOrderList();
    },
    //获取订单列表所有数据
    async getOrderList() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.info,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取订单数据失败!");
        return;
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取订单数据成功!");

      console.log(res);
    },
    //每页条数发生改变
    handleSizeChange(Size) {
      this.info.pagesize = Size;
      this.getOrderList();
      console.log(Size);
    },
    //当前页发生改变
    handleCurrentChange(Current) {
      this.info.pagenum = Current;
      this.getOrderList();

      console.log(Current);
    },
    //修改按钮
    modifyAddress() {
      this.addressDialog = true;
    },
    handleChange() {
      console.log(this.cityModel);
    },
  },
};
</script>

<style scoped lang="less">
.el-input {
  width: 30%;
  margin-bottom: 15px;
}
.el-input,
.el-cascader {
  width: 100%;
}
.el-input {
  width: 30%;
}
</style>
