<template>
  <div>
    <!--面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品提醒消息 -->
    <el-alert
      class="messageStyle"
      title="添加商品信息"
      type="info"
      show-icon
      :closable="false"
      center
    >
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      :space="200"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form
      label-position="top"
      :rules="addGoodsRules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      :model="addGoodsRuleForm"
    >
      <el-tabs
        tab-position="left"
        style="height: 200px;"
        v-model="activeIndex"
        :before-leave="beforeTabLeave"
        @tab-click="tabCliked"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsRuleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsRuleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsRuleForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsRuleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expand-trigger="hover"
              v-model="addGoodsRuleForm.goods_cat"
              :options="addGoodsOptions"
              :props="addGoodsProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 渲染表单的item项 -->
          <el-form-item
            :label="item.attr_name"
            v-for="item in this.goodsParameter"
            :key="item.attr_id"
          >
            <!-- 多选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="ab"
                v-for="(ab, i) in item.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form
            v-for="(at, a) in attributeOnlyList"
            :key="a"
            :model="at"
            label-position="top"
          >
            <el-form-item :label="at.attr_name">
              <el-input v-model="at.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="handellSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="商品内容" name="4">
          <!-- 文本编辑器 -->
          <quill-editor
            v-model="addGoodsRuleForm.goods_introduce"
          ></quill-editor>
          <el-button
            type="primary"
            class="submitButonnt"
            @click="addGoodsCommodity()"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 图片预览对对话框 -->
    <el-dialog title="图片预览" :visible.sync="ImgDialog" width="50%">
      <span slot="footer" class="dialog-footer">
        <img :src="previewUrl" class="imgStyle" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      /* 添加商品信息 */
      addGoodsRuleForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的选中分类id数组
        goods_cat: [],
        /* 图片临时路径 */
        pics: [],
        // 富文本输入的商品介绍
        goods_introduce: "",
        attrs: [],
      },

      /* 添加商品验证信息 */
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      /* 级联选择器数据源 */
      addGoodsOptions: [],
      /* 商品分类配置对象 */
      addGoodsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeIndex: "0",
      //商品属性动态数据
      goodsParameter: [],
      //商品属性静态数据
      attributeOnlyList: [],
      //图片上传的url地址
      uploadUrl: "http://119.45.224.208:8888/api/private/v1/upload",
      //图片上传的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //图片对话框
      ImgDialog: false,
      //对话框显示图片的绝对地址
      previewUrl: "",
      //文本编辑器输入的内容
      content: "",
    };
  },
  computed: {
    cateId() {
      if (this.addGoodsRuleForm.goods_cat.length == 3) {
        return this.addGoodsRuleForm.goods_cat[2];
      }
      return null;
    },
  },
  watch: {},
  created() {
    this.getGoodsClassiFication();
  },
  mounted() {},
  methods: {
    /* 获取商品分类所有数据 */
    async getGoodsClassiFication() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类信息失败");
      }
      this.addGoodsOptions = res.data;
      this.$message.success("获取商品分类信息成功");
    },
    /* 级联选中器选中节点发生变化时触发 */
    handleChange(newValue) {
      if (this.addGoodsRuleForm.goods_cat.length !== 3) {
        this.addGoodsRuleForm.goods_cat = [];
        this.$message.error("只能选中三级选项");
        return;
      }
      console.log(this.addGoodsRuleForm.goods_cat);
    },
    /*  */
    beforeTabLeave(activeName, oldActiveName) {
      /*   console.log(activeName + "前往");
      console.log(oldActiveName + "曾经"); */
      if (this.addGoodsRuleForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类!");
        return false;
      }
    },
    /* 商品参数被点击时触发 */
    async tabCliked() {
      if (this.activeIndex == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        this.goodsParameter = res.data;
        if (res.meta.status == 200) {
          res.data = this.goodsParameter;
          this.$message.success("获取参数详情成功!");
          /* 获取到商品参数 */
          res.data.forEach((item) => {
            if (item.attr_vals.length > 0) {
              var a = item.attr_vals.split(" ");
              item.attr_vals = a;
            }
          });
          console.log(res.data);
          console.log(this.goodsParameter);
          return;
        }
        this.$message.error("获取参数详情失败!");
        return;
      } else if (this.activeIndex == 2) {
        const { data: attribute } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        this.attributeOnlyList = attribute.data;
        console.log(attribute);
        console.log(this.attributeOnlyList);
      }
    },
    /* 处理图片预览效果 */
    handlePreview(file) {
      //previewUrl
      console.log(file);
      const i = file.response.data.url;
      const c = i.replace("127.0.0.1", "119.45.224.208");
      this.previewUrl = c;
      console.log(c);

      this.ImgDialog = true;
    },
    //处理图片移出操作
    handleRemove(file) {
      console.log("移出", file);
      //根据临时路径查找到图片的索引
      const filePath = file.response.data.tmp_path;
      const b = this.addGoodsRuleForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addGoodsRuleForm.pics.splice(b, 1);
      console.log(this.addGoodsRuleForm.pics);
    },
    /* 图片上传成功,触发该钩子函数 */
    handellSuccess(list) {
      if (list.meta.status !== 200) {
        this.$message.error("上传图片失败!");
        return;
      }
      this.$message.success("上传图片成功!");
      const picInfo = { pic: list.data.tmp_path };
      this.addGoodsRuleForm.pics.push(picInfo);
      console.log(this.addGoodsRuleForm.pics);
    },
    //添加商品
    addGoodsCommodity() {
      console.log("进来了");
      // 1.校验整个表单,表单验证通过,发起添加商品请求
      this.$refs.ruleForm.validate(async (x) => {
        console.log(x);
        if (!x) {
          this.$message.error("请填写必要的添加信息!");
          return;
        }
        //深拷贝
        const i = _.cloneDeep(this.addGoodsRuleForm);
        i.goods_cat = i.goods_cat.join(",");
        console.log(i);
        //处理动态参数
        this.goodsParameter.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addGoodsRuleForm.attrs.push(newInfo);
        });
        //处理静态属性
        this.attributeOnlyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addGoodsRuleForm.attrs.push(newInfo);
        });
        i.attrs = this.addGoodsRuleForm.attrs;
        //发起请求添加商品
        //注意! 用户输入的商品名称必须是唯一的
        const { data: res } = await this.$http.post(`goods`, i);
        if (res.meta.status !== 201) {
          this.$message.error("添加商品失败!");
          return;
        }
        this.$message.success("添加商品成功!");
        this.$router.push("/goods");
      });
    },
  },
};
</script>

<style scoped lang="less">
.messageStyle {
  margin-top: 10px;
}
.el-tabs--left,
.el-tabs--right {
  overflow: visible;
}
.el-checkbox {
  margin-right: 0px;
}
.imgStyle {
  width: 100%;
}
.el-dialog {
  overflow: hidden;
  text-align: center;
}
.quill-editor {
  margin-top: 15px;
}
.submitButonnt {
  margin-top: 15px;
}
</style>
