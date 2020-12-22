<template>
  <div class="bgColor">
    <div class="verification">
      <!-- 图标区域 -->
      <div class="iconBox">
        <img src="@/assets/logo.png" />
      </div>
      <!-- 表单验证区域 -->
      <el-form
        ref="formHome"
        :model="formHomeLinst"
        :rules="homeRules"
        label-width="0px"
        class="inputFormStyle"
      >
        <el-form-item prop="name">
          <el-input
            prefix-icon="iconfont icon-icontouxiang"
            v-model="formHomeLinst.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            prefix-icon="iconfont icon-lock"
            v-model="formHomeLinst.pass"
          ></el-input>
        </el-form-item>
        <el-form-item class="buttonStyle">
          <el-button type="primary" @click="intoHome()">登录</el-button>
          <el-button type="info" @click="clear()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      formHomeLinst: {
        name: "admin",
        pass: "123456",
      },

      homeRules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pass: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "密码必须是6位数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /* 点击重置表单*/
    clear() {
      this.$refs.formHome.resetFields();
    },
    /* 点击登录 */
    intoHome() {
      /* 登录前预校验 */
      this.$refs.formHome.validate(async (valisate) => {
        /*  console.log(valisate); */
        if (!valisate) {
          this.$message.error("登录失败!请重新输入账户和密码!");
        } else {
          var data = await this.$http.post("login", {
            username: this.formHomeLinst.name,
            password: this.formHomeLinst.pass,
          });
        }
        if (data.status !== 200) {
          this.$message.error("登录失败");
        } else {
          this.$message.success("登录成功");
          /* 登录成功需要做以下事情 */
          /* 1.登录成功要保存服务器分配过来的token值,存到客户端的sessionStorage中,以便后续调用登录后才能调用的API接口
          注意昂: 有些请求,服务器一定要知道你是登录成功的状态才能访问.那么怎么才能知道登录状态呢?
                ---token =>token是登录成功之后,服务器给我们颁发的登录成功状态,通过保存它,下次我们发请求的时候带上他,就可以拿到登录成功后的状态
          2.项目中除了登录之外的其他api接口,必须在登录之后才能访问
          3.token只应在当前网站打开期间生效,所以token保存在sessionStorage中
          4.通过编程式导航跳转到后台主页
          */
          window.sessionStorage.setItem("token", data.data.data.token);
          this.$router.push("/welcome");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bgColor {
  background-color: #194a6e;
  height: 100%;
  .verification {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    bottom: 0;
    height: 300px;
    width: 450px;
    background-color: white;
    border-radius: 4px;
  }
  .iconBox {
    position: relative;
    top: -70px;
    left: 50%;
    margin-left: -65px;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: white;
    padding: 10px;
    box-shadow: #eceeeb 0 0 10px;
    border: 1px solid #eee;

    img {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      background-color: #eceeeb;
    }
  }
}
.buttonStyle {
  display: flex;
  justify-content: flex-end;
}
.inputFormStyle {
  margin-top: -30px;
  padding: 0 10px;
}
</style>
