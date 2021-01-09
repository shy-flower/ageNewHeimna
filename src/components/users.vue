<template>
  <div>
    <!--面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容主体 -->
    <el-card>
      <div class="inputBox">
        <el-input
          placeholder="请输入搜索内容"
          v-model="info.query"
          class="input-with-select"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="findUsers()"
          ></el-button>
        </el-input>
        <el-button @click="addUsers()" class="addButton" type="primary"
          >添加用户</el-button
        >
      </div>
      <!-- 表格区域 -->
      <el-table :data="usersTableList" border style="width: 100%">
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#DDDFE6"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="clickModifyUsers(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUsers(scope.row)"
            >
            </el-button>
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="clickAssignRolesDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="usersSizeChange"
        @current-change="usersCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框区域 -->
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUsersDialog" width="30%">
      <el-form
        :model="addUsersForm"
        :rules="addUsersRules"
        ref="addUsersRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsersForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUsersForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsersForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUsersForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUsersDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUsers()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="modifyDialogVisible"
      width="30%"
    >
      <el-form
        :model="modifyUsers"
        :rules="addUsersRules"
        ref="modifyUsersRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modifyUsers.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyUsers.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUsers()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignRolesDialog" width="30%">
      <p>当前的用户:{{ roleUsers }}</p>
      <p>当前的角色:{{ currentRole }}</p>
      <span>分配新的角色:</span>
      <el-select v-model="selectRoleValue" placeholder="请选择">
        <el-option
          v-for="(item, index) in RoleList"
          :key="index"
          :label="item.role_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeRoles">确 定</el-button>
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
      usersTableList: [],
      /* 请求参数 */
      info: {
        pagenum: 1, //当前页码
        pagesize: 5, //每页显示条数
      },
      /* 数据总条数 */
      totalpage: 0,
      mg_stateValue: true,
      addUsersDialog: false, //添加用户对话框
      addUsersForm: {
        //添加用户信息
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加用户信息验证规则
      addUsersRules: {
        username: [
          { required: true, message: "请输入用户名!", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 6, message: "密码必须是6为数值", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 6,
            message: "邮箱长度在3-6位数值之间",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "手机号必须是11位数值",
            trigger: "blur",
          },
        ],
      },
      modifyDialogVisible: false,
      /* 修改用户信息 */
      modifyUsers: {
        id: 0,
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      /* 分配角色对话框 */
      assignRolesDialog: false,
      /* 下拉框被选中的角色 */
      selectRoleValue: "",
      /* 分配角色信息 */
      RoleList: [],
      /* 分配角色的当前用户信息*/
      roleUsers: "",
      /* 分配角色的当前角色*/
      currentRole: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getUsersList();
  },
  mounted() {},
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: {
          query: this.info.query,
          pagenum: this.info.pagenum,
          pagesize: this.info.pagesize,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败");
      }
      console.log(res);
      this.usersTableList = res.data.users;
      this.RoleList = res.data.users;
      this.totalpage = res.data.total;

      this.$message.success("用户用户列表数据成功");
      return;
    },
    /* 点击保存修改状态 */
    async changeState(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改状态失败!");
      }
      return this.$message.success("修改状态成功!");
    },
    /* 添加用户 */
    addUsers() {
      this.addUsersDialog = true;
    },
    /* 提交添加用户信息 */
    submitAddUsers() {
      this.$refs.addUsersRef.validate(async (value) => {
        if (!value) {
          return this.$message.error("添加用户信息失败!请重新输入");
        }
        await this.$http.post("users", {
          username: this.addUsersForm.username,
          password: this.addUsersForm.password,
          email: this.addUsersForm.email,
          mobile: this.addUsersForm.mobile,
        });
        this.$message.success("添加用户信息成功!");
        this.$refs.addUsersRef.resetFields();
        this.addUsersDialog = false;
        this.getUsersList();
        return;
      });
    },
    //搜索用户信息
    async findUsers() {
      const { data: res } = await this.$http.get("users", {
        params: {
          query: this.info.query,
          pagenum: this.info.pagenum,
          pagesize: this.info.pagesize,
        },
      });
      this.usersTableList = res.data.users;
      console.log(res);
    },
    /* 点击删除用户信息 */
    deleteUsers(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`users/${row.id}`);
          this.getUsersList();
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    /* 点击显示修改用户信息对话框 */
    async clickModifyUsers(row) {
      const { data: res } = await this.$http.get(`users/${row.id}`);
      this.modifyUsers = res.data;
      this.modifyDialogVisible = true;
    },
    /* 点击提交修改用户信息 */
    async changeUsers() {
      const { data: res } = await this.$http.put(
        `users/${this.modifyUsers.id}`,
        {
          email: this.modifyUsers.email,
          mobile: this.modifyUsers.mobile,
        }
      );
      console.log(res.meta);
      if (res.meta.status !== 200) {
        this.$message.error("修改用户信息失败!");
      }

      this.$message.success("修改用户信息成功!");
      this.getUsersList();
      this.modifyDialogVisible = false;
    },
    /* 显示分配权限对话框 */
    clickAssignRolesDialog(row) {
      this.roleUsers = row.username;
      this.currentRole = row.role_name;
      this.assignRolesDialog = true;
    },
    /* 分配角色授权 */
    submitChangeRoles() {
      console.log("未实现");
      /* console.log(this.selectRoleValue);
      const { data: res } = this.$http.post(
        `roles/${this.selectRoleValue}/rights`
      );
      console.log(res);
    */
      this.assignRolesDialog = false;
    },
    /* 每页/条数发生改变触发 */
    usersSizeChange(pagesize) {
      this.info.pagesize = pagesize;
      this.getUsersList();
    },
    /* 当前页发生该改变 */
    usersCurrentChange(page) {
      this.info.pagenum = page;
      this.getUsersList();
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
