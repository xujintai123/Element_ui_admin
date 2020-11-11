<template>
  <div id="cate">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="showCateDialog">添加分类</el-button>

      <table-tree
        class="table-tree"
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        align="center"
        headerAlign="center"
        show-index
        border
        stripe
        :data="cateList"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="delete" scope="scope">
          <i v-if="scope.row.cat_deleted===true" class="el-icon-error" style="color:green"></i>
          <i v-else class="el-icon-success" style="color:green"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0" type="primary" plain disabled>一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success" plain disabled>二级</el-tag>
          <el-tag size="mini" v-else type="warning" plain disabled>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="option" scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </table-tree>

      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pagenum"
        :page-sizes="[5,10,15, 20]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类:" prop="cat_name">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 :props="{value:"", label:"",children:""}"-->
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{value:'cat_id', label:'cat_name',children:'children',checkStrictly:true}"
            @change="parentCateChange"
            expandTrigger="hover"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateFormData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
       // 商品列表
      cateList:[],
      query:{
        type:3,
        //当前页码数
        pagenum:1,
        //当前每页数据数量
        pagesize:15
      },
      // 当页总数据数
       total:0,
      //table-tree每列数据
       columns: [  
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            type: 'template',
            template:'delete'
          },
          {
            label: '排序',
            //表示将当前列设置为模板列
            type: 'template',
            //表示当前列的模板名称
            template:'order'
          },
            {
            label: '操作',
            type: 'template',
            template:'option'
          },
        ],
        //添加分类dialog对话框
        addCateDialogVisible:false,
        //添加分类的表单数据对象
        addCateForm:{
          //将要添加分类的名称
           cat_name:'',
          //父级分类的Id
           cat_pid:0,
          //分类的等级，默认添加的是1级分类
           cat_level:0,
        },
        //添加分类的表单数据验证规则
        addCateFormRules:{
           cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max:8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
          ],
        },
        //父级分类的数据列表
        parentCateList:[],
        //选中的父级分类的Id数组
        selectedKeys:[],
    }
  },
  created(){
  this.getCateList()
  },
  methods:{
    //请求数据的方法
    //请求商品列表数据
   async getCateList(){
    const {data:res} = await this.$http.get('categories',{params:this.query}) 
    if(res.meta.status!==200) 
    return this.$message.error('服务器故障，获取商品数据失败')
   
    this.cateList = res.data.result
    // console.log(this.cateList);
    this.total=res.data.total
    },
    //监听每页数据数量（pagesize）改变;页面数量改变，根据query的当前页面数量参数重新请求数据
     handleSizeChange( pagesize) {
      this.query.pagesize = pagesize
      this.getCateList()
      },
      //监听页码（pagenum）改变
     handleCurrentChange(pagenum) {
      this.query.pagenum = pagenum
      this.getCateList()
     },
    //点击添加分类按钮，显示对话框
     showCateDialog() {
     //获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible=true
     },
     //点击确定按钮，提交数据发送请求，添加新的分类
     addCateFormData(){
       this.$refs.addCateFormRef.validate(async  valid => {
          if (valid) {
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status!==201) 
          return this.$message.error('服务器繁忙，数据请求失败')

          console.log(res);
          this.$message.success('创建成功')
          //刷新数据
          this.getCateList()
          this.addCateDialogVisible = false

          } else {
            this.$message.error('请填写规范的数据');
          }
        });
     
       console.log(this.addCateForm);
     },
     //获取父级分类的数据列表
     async  getParentCateList(){
     const {data:res} = await this.$http.get('categories',{params:{type:2}})
     if(res.meta.status!==200) 
     return this.$message.error('服务器繁忙，数据请求失败')

     this.parentCateList=res.data
    },
    //级联选择器选择项发生改变，触发这个函数
     parentCateChange() {
       //判断是否选择父级列表(selectedKeys数组中的数组值)；
       //没有数值即长度为0为未选择父级列表
       if(this.selectedKeys.length>0){
        // 获取最近一级的父级pid
       this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        // 根据父级列表(selectedKeys数组中的数组值)获取分类的等级
       this.addCateForm.cat_level=this.selectedKeys.length
       }

       else {
       this.addCateForm.cat_pid=0
       this.addCateForm.cat_level=0
       }
     
    },
    //监听添加分类的对话框关闭事件,清空对话框数据
     addCateDialogClose() {
       this.addCateForm.cat_name=''
       this.selectedKeys=[]
       this.addCateForm.cat_pid=0
       this.addCateForm.cat_level=0
     }
  }


}
</script>

<style scoped lang="less">
 .table-tree {
   margin-top: 20px;
 }
 
 .el-cascader {
   width: 100%;
 }
 
</style>