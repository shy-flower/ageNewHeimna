<template>
  <div>
    <el-button @click="outHome()" type="info">退出</el-button>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /* 点击退到登录页面,并销毁token */
    outHome() {
      window.sessionStorage.clear();
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped lang="less">
.el-header {
  background-color: #343d40;
  color: white;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #343d40;
  color: white;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
