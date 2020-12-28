<template>
  <div>
    <!--面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="cardStyle">
      <el-table :data="rightList" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else-if="scope.row.level == '2'" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
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
      rightList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getRightList();
  },
  mounted() {},
  methods: {
    /* 获取权限列表 */
    async getRightList() {
      const { data: res } = await this.$http.get(`rights/list`);
      console.log(res);
      this.rightList = res.data;
    },
  },
};
</script>

<style scoped lang="less">
.cardStyle {
  margin-top: 10px;
}
</style>
