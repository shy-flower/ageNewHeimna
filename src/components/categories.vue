<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addcate">添加分类</el-button>
      <!-- 树形图表 -->
      <tree-Table
        :selection-type="false"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color :lightgreen "
          ></i>
          <i class="el-icon-error" style="color :red" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-Table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="infoList.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="infoList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="editeDialog" width="30%">
      <el-form
        :model="formInfo"
        :rules="editRulesForm"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="formInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editeDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" width="30%">
      <el-form
        :model="cateFrom"
        :rules="addCateRules"
        ref="addCateRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="cateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            props.checkStrictly="true"
            v-model="value"
            :options="cateListArry"
            :props="cateCascObj"
            expandTrigger="hover"
            @change="handleChange"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddCateDialog">取 消</el-button>
        <el-button type="primary" @click="submitCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      infoList: {
        type: 3,
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      total: 1, //数据总条数
      cateList: [], //商品分类数据
      //为table配置内容
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      editeDialog: false,
      //编辑对话框的表单验证规则
      editRulesForm: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      formInfo: {
        cat_name: "",
        cat_id: "",
      },
      //添加分类对话框
      addCateDialog: false,
      cateFrom: {
        cat_name: "",
        cat_pid: 0, //父级分类id
        cat_level: 0, //分类的等级默认添加一级分类
      },

      //添加分类验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //分级分类列表
      cateListArry: [],
      //配置级联选择器
      cateCascObj: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择器 选择的id数组
      value: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getCateList();
  },
  mounted() {},
  methods: {
    //添加分类按钮
    async addcate() {
      console.log("添加按钮");
      //获取分类参数数据
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取分类参数失败");
        return;
      }
      this.$message.success("获取分类参数成功");
      this.cateListArry = res.data;
      console.log(res.data);
      this.addCateDialog = true;
    },
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.infoList,
      });
      console.log(res);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //pageSize 发生改变触发 每页条数
    handleSizeChange(pageSize) {
      this.infoList.pagesize = pageSize;
      console.log(pageSize);
      this.getCateList();
    },
    //currentPage 改变时会触发 当前页
    handleCurrentChange(currentPage) {
      this.infoList.pagenum = currentPage;
      this.getCateList();

      console.log(currentPage);
    },
    //编辑按钮
    editCate(row) {
      this.editeDialog = true;
      this.formInfo.cat_name = row.cat_name;
      this.formInfo.cat_id = row.cat_id;
      console.log(name);
    },
    //删除按钮
    deleteCate(row) {
      debugger;
      this.$confirm("此操作将永久删除该分类信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${row.cat_id}`
          );
          if (res.meta.status !== 200) {
            this.$message.error("删除失败!");
            return;
          }
          debugger;

          this.getCateList();
          this.$message.success("删除成功!");
        })
        .catch(() => {
          debugger;
          this.$message.info("已取消");
          return;
        });
    },
    //修改提交按钮
    async submitCate() {
      const { data: res } = await this.$http.put(`categories/${row.cat_id}`, {
        cat_name: this.formInfo.cat_name,
      });
      if (res.meta.status !== 200) {
        this.$message.error("编辑失败!");
        return;
      }
      this.$message.success("编辑成功!");
      this.editeDialog = false;
      this.getCateList();
    },
    //级联选择发生变化时触发,返回最新的选中值数组
    handleChange() {
      console.log(this.value);
      //如果 value数组中的lenght大于0,证明选中的父级分类
      //反之,就说明没有选中任何父级分类
      if (this.value.length > 0) {
        //拿到父级分类id
        this.cateFrom.cat_pid = this.value[this.value.length - 1];
        //为当前分类的等级赋值
        this.cateFrom.cat_level = this.value.length;
        return;
      } else {
        //走这个分支,证明添加的分类都是1级的
        //将分类父级id和分类等级重置为0
        this.cateFrom.cat_pid = 0;
        this.cateFrom.cat_level = 0;
      }
    },
    //点击确定按钮添加分类
    async submitCate() {
      console.log(this.cateFrom);
      const { data: res } = await this.$http.post(`categories`, this.cateFrom);
      if (res.meta.status !== 201) {
        this.$message.error("添加分类失败!");
        return;
      }
      this.$message.success("添加分类成功!");
      this.addCateDialog = false;
      this.getCateList();
      this.cateFrom = {};
    },
    //点击取消按钮,取消添加分类
    cancelAddCateDialog() {
      this.cateFrom = {};
      this.value = [];
      this.addCateDialog = false;
    },
  },
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
