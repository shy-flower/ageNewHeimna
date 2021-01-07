<template>
  <div>
    <!--面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="margin-top: 15px;">
      <!-- 搜索区域 -->
      <div class="inputBox">
        <el-input
          placeholder="请输入搜索内容"
          v-model="goodsInfo.query"
          class="input-with-select"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="findGoods()"
          ></el-button>
        </el-input>
        <el-button @click="addGoods()" class="addButton" type="primary"
          >添加商品</el-button
        >
      </div>
      <!-- tabel表格区域 -->
      <el-table :data="goodsTableData" border class="tabelGoods">
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(/元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | time }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改商品按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除商品按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="goodsSizeChange"
        @current-change="goodsCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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
      goodsInfo: {
        query: "", //查询参数
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      total: 1, //数据总条数
      /* 商品表格数据 */
      goodsTableData: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getGoodsList();
  },
  mounted() {},
  methods: {
    /* 获取所有商品信息 */
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: {
          query: this.goodsInfo.query,
          pagenum: this.goodsInfo.pagenum,
          pagesize: this.goodsInfo.pagesize,
        },
      });
      /* 获取到所有goods信息 */
      this.goodsTableData = res.data.goods;
      /* 保存数据总条数 */
      this.total = res.data.total;
    },
    /* 点击搜索商品 */
    findGoods() {
      this.getGoodsList();
    },
    /*点击添加商品 */
    addGoods() {
      this.$router.push("/addGoods");
    },
    /* 删除商品信息 */
    async deleteGoods(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `goods/${row.goods_id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除商品失败");
          }
          this.$message.success("删除商品成功");
          this.getGoodsList();
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    /* 每页/条发生改变 */
    goodsSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      this.getGoodsList();
    },
    /* 当前页发生改变 */
    goodsCurrentChange(newCurrent) {
      this.goodsInfo.pagenum = newCurrent;
      this.getGoodsList();
    },
  },
};
</script>

<style scoped lang="less">
.inputBox {
  display: flex;
  width: 500px;
  margin-bottom: 18px;
  .addButton {
    margin-left: 25px;
  }
}
</style>
