<template>
  <div class="divBox">
    <el-container>
      <!-- 头部信息 -->
      <el-header>
        <div>
          <img src="@/assets/logo.png" />
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="outHome()" size="mini" type="info">退出</el-button>
      </el-header>
      <!-- 左边信息 -->
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 导航栏信息 -->
          <el-menu
            background-color="#343D40"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <div class="togoter-button" @click="togoterButton()">|||</div>

            <!-- 一级菜单模板区域 -->
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in leftList"
              :key="index"
            >
              <template slot="title">
                <i class="iconStyle" :class="iconObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单模板区域 -->
              <el-menu-item-group>
                <el-menu-item
                  :index="'/' + item2.path"
                  v-for="(item2, index) in item.children"
                  :key="index"
                >
                  <i class="el-icon-menu"></i>
                  <span>{{ item2.authName }}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 中间信息 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      leftList: {},
      iconObj: {
        "125": "iconfont icon-yonghu",
        "103": "iconfont icon-quanxian",
        "101": "iconfont  icon-shangpin",
        "102": "iconfont  icon-dingdan",
        "145": "iconfont  icon-pingtaiiconhuizong_huaban1fuben4",
      },
      isCollapse: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getLeftList();
  },
  mounted() {},
  methods: {
    /* 点击退到登录页面,并销毁token */
    outHome() {
      window.sessionStorage.clear();
      this.$router.push("/home");
    },
    /* 获取左侧菜单内容 */
    async getLeftList() {
      const res = await this.$http.get("/menus");
      if (res.data.meta.status === 200) {
        this.$message.success("获取左侧列表成功");
        this.leftList = res.data.data;
      }
    },
    /* 点击折叠导航栏 */
    togoterButton() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped lang="less">
.el-menu {
  border-right: none;
}
.iconStyle {
  margin-right: 5px;
}
.divBox {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #343d40;
  color: white;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 0;
  div {
    display: flex;
    align-items: center;
    font-size: 25px;
  }
  img {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
}

.el-aside {
  background-color: #343d40;
  color: white;
  text-align: center;
  height: 100%;
  div {
    display: block;
    background-color: #435263;
    height: 25px;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
}
.togoter-button {
  letter-spacing: 0.2em;
  text-align: center;
}
</style>
