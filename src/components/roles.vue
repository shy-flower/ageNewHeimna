<template>
  <div>
    <!--面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="rolesStyle">
      <!-- 添加角色 -->
      <el-button type="primary" @click="clickAddRoles">添加角色</el-button>
      <!-- tabel表格 -->
      <el-table :data="RolesList" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, i1) in scope.row.children"
              :key="i1"
              class="rowTop"
            >
              <!-- 渲染一级列表 -->
              <el-col :span="5">
                <el-tag closable @click="clearRoles(scope.row, item.id)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级列表 -->
              <el-col :span="19">
                <!-- 渲染二级列表 -->
                <el-row
                  v-for="(item2, i2) in item.children"
                  :key="i2"
                  class="centerStyle"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @click="clearRoles(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级列表 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      type="warning"
                      closable
                      @close="clearRoles(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="clickAssignRoles(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesdialog" width="30%">
      <!-- 添加角色表单 -->
      <el-form
        :model="rulesFormList"
        :rules="rulesForm"
        ref="rulesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rulesFormList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rulesFormList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="editRolesDialog" width="30%">
      <el-form ref="editRolesRef" :model="editRolesList" label-width="80px">
        <el-form-item label="角色名称">
          <el-input
            v-model="editRolesList.roleName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="clickSubmitRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="AssignRolesDialog"
      @close="setRolesDialogClosed()"
      width="30%"
    >
      <el-tree
        default-expand-all
        :data="TreeRoleList"
        show-checkbox
        :default-checked-keys="SelectRoles"
        node-key="id"
        :props="RolesDefaultProps"
        ref="treeRef"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AssignRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="subAssignRoles()">确 定</el-button>
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
      RolesList: [],
      addRolesdialog: false, //添加角色对话框
      //添加角色信息
      rulesFormList: {
        roleName: "",
        roleDesc: "",
      },
      /* 添加角色验证规则 */
      rulesForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editRolesDialog: false,
      /* 编辑角色信息 */
      editRolesList: {
        roleId: 0,
        roleName: "",
        roleDesc: "",
      },
      //分配权限对话框
      AssignRolesDialog: false,
      RolesDefaultProps: {
        label: "authName",
        children: "children",
      },
      /* 树形控件要展示的所有权限 */
      TreeRoleList: [],
      /* 在tree控件上显示已有的三级权限 */
      SelectRoles: [],
      roleID: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getRolesList();
  },
  mounted() {},
  methods: {
    /* 获取角色列表信息 */
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      this.RolesList = res.data;
    },
    /* 点击显示添加角色对话框 */
    clickAddRoles() {
      this.addRolesdialog = true;
    },
    /* 提交添加角色信息 */
    submitAddRoles() {
      this.$refs.rulesRef.validate(async (value) => {
        if (!value) {
          this.$message.error("请正确输入添加角色信息");
          return;
        }
        this.$http.post("roles", {
          roleName: this.rulesFormList.roleName,
          roleDesc: this.rulesFormList.roleDesc,
        });
        this.$message.success("添加角色信息成功");
        this.getRolesList();
        this.addRolesdialog = false;
        this.$refs.rulesRef.resetFields();
      });
    },
    /* 显示编辑对话框 */
    editRoles(row) {
      this.findRolesMessage(row);
      this.editRolesDialog = true;
    },
    /* 根据id角色查询信息 */
    async findRolesMessage(row) {
      console.log(row);
      const { data: res } = await this.$http.get(`roles/${row.id}`, {
        params: {
          roleName: row.roleName,
          roleDesc: row.roleDesc,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败!");
      }
      console.log(res.data);
      this.editRolesList = res.data;
      console.log(this.editRolesList);
    },
    /* 提交修改好的角色信息 */
    clickSubmitRoles() {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("修改角色信息失败!");
        }
        await this.$http.put(`roles/${this.editRolesList.roleId}`, {
          roleName: this.editRolesList.roleName,
          roleDesc: this.editRolesList.roleDesc,
        });
      });
      this.getRolesList();
      this.$message.success("修改角色信息成功!");
      this.editRolesDialog = false;
    },
    /* 删除角色信息 */
    deleteRoles(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("进来了");
          this.$http.delete(`roles/${row.id}`);
          this.$message.success("删除成功!");
          this.editRolesDialog = false;
          this.getRolesList();

          return;
        })
        .catch(() => {
          return this.$message.error("已取消删除");
        });
    },
    /* 删除角色 */
    clearRoles(row, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${row.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            this.$message.error("删除失败!");
          }
          row.children = res.data;
          this.$message.success("删除成功!");
        })
        .catch(() => {
          this.$message.info("已取消!");
        });
    },
    /* 点击分配权限按钮 */
    async clickAssignRoles(row) {
      this.roleID = row.id;

      /* 发起请求拿到所有角色权限 */
      const { data: res } = await this.$http.get(`rights/tree`);
      this.TreeRoleList = res.data;
      this.handelRoles(row, this.SelectRoles);

      this.AssignRolesDialog = true;
    },
    /* 递归,拿到角色权限 */
    //拿到三级权限角色列表
    handelRoles(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.handelRoles(item, arr));
    },

    /* 确定分配权限 */
    async subAssignRoles() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleID}/rights`,
        { rids: idStr }
      );

      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功!");
      this.getRolesList();
      this.AssignRolesDialog = false;
    },
    /* 监听分配全选对话框的关闭事件 */
    setRolesDialogClosed() {
      this.SelectRoles = [];
    },
  },
};
</script>

<style scoped lang="less">
.rolesStyle {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.el-row {
  border-bottom: 1px solid #eee;
}
.rowTop {
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
}
.centerStyle {
  display: flex;
  align-items: center;
}
</style>
