<template>
  <div id="pramas">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert :closable="false" show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="selectCate">
        <el-col>
          <span>选择商品分类</span>
          <!-- 级联选择器 -->
          <el-cascader
            @change="selectedCateChange"
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{value:'cat_id', label:'cat_name',children:'children', expandTrigger: 'hover' }"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 选项卡区域 -->
      <el-tabs v-model="activeTabName" type="border-card" @tab-click="TabClick">
        <!-- 添加动态参数的模板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" :disabled="tabIsDisabled" @click="btnAddParam">添加参数</el-button>

          <!-- 动态参数的表格 -->
          <el-table border :data="manyTableData" stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 循环渲染Tag标签 -->
              <template scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeParamsTag(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加新Tag的输入文本框 -->
                <el-input
                  class="addTagInput"
                  v-if="scope.row.addTagVisible"
                  v-model="scope.row.addTagInputValue"
                  ref="addTagInput"
                  size="small"
                  @keyup.enter.native="addTagInputConfirm(scope.row)"
                  @blur="addTagInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加新Tag按钮 -->
                <el-button
                  v-else
                  class="addTagButton"
                  size="small"
                  @click="showAddTagInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
            <el-table-column align="center" prop="attr_name" label="参数名称" width="600"></el-table-column>
            <el-table-column align="center" label="操作" width="600">
              <!-- 模板插槽 -->
              <template scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  @click="deleteParamsData(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的模板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" :disabled="tabIsDisabled" @click="btnAddAttributes">添加属性</el-button>

          <!-- 静态属性的表格 -->
          <el-table border :data="onlyTableData" stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 循环渲染Tag标签 -->
              <template scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeParamsTag(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加新Tag的输入文本框 -->
                <el-input
                  class="addTagInput"
                  v-if="scope.row.addTagVisible"
                  v-model="scope.row.addTagInputValue"
                  ref="addTagInput"
                  size="small"
                  @keyup.enter.native="addTagInputConfirm(scope.row)"
                  @blur="addTagInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加新Tag按钮 -->
                <el-button
                  v-else
                  class="addTagButton"
                  size="small"
                  @click="showAddTagInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
            <el-table-column align="center" prop="attr_name" label="属性名称" width="600"></el-table-column>
            <el-table-column align="center" label="操作" width="600">
              <!-- 模板插槽 -->
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteParamsData(scope.row.attr_id)"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数属性对话框（根据 activeTabName）动态决定对话框为动态参数还是静态属性 -->
    <el-dialog
      @close="addParamsFormClose"
      :title="'添加'+FormDataType"
      :visible.sync="addParamsFormVisible"
      width="50%"
    >
      <!-- 验证表单数据 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsForm"
        label-width="100px"
      >
        <el-form-item :label="FormDataType" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsFormVisible  = false">取 消</el-button>
        <el-button type="primary" @click="addParamsFormData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数属性对话框（根据 activeTabName）动态决定对话框为动态参数还是静态属性 -->
    <el-dialog
      @close="editParamsFormClose"
      :title="'添加'+FormDataType"
      :visible.sync="editParamsFormVisible"
      width="50%"
    >
      <!-- 验证表单数据 -->
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsForm"
        label-width="100px"
      >
        <el-form-item :label="FormDataType" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsFormVisible  = false">取 消</el-button>
        <el-button type="primary" @click="editParamsFormData">确 定</el-button>
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
      //级联选择框绑定的数据
      selectedCateKeys:[],
      //tab选项卡双向绑定的数据
      activeTabName:'many',
      manyTableData:[],
      onlyTableData:[],
      //添加参数属性的对话框是否显示
      addParamsFormVisible:false,
      //添加参数属性对话框表单数据
       addParamsForm:{
           attr_name:'',
       },
      //验证添加参数属性对话框表单数据
       addParamsFormRules:{
         attr_name:[
              { required: true, message: '内容不能为空'},
              { min:1,max:10, message: '内容在1到10个字符之间'}
           ]
       },
       
      //编辑参数属性的对话框是否显示
      editParamsFormVisible:false,
      //编辑参数属性对话框表单数据
       editParamsForm:{
           attr_name:'',
       },
      //验证编辑参数属性对话框表单数据
       editParamsFormRules:{
         attr_name:[
              { required: true, message: '内容不能为空'},
              { min:1,max:10, message: '内容在1到10个字符之间'}
           ]
       },
      //  //控制（添加Tag）按钮与文本框切换显示
      //  addTagVisible:false,
      //  //（添加Tag）文本框输入内容
      //  addTagInputValue:''
 
  }
},
created(){
this.getCateList()
},
methods:{
  //请求数据的方法
  //请求商品列表数据
   async getCateList(){
    const {data:res} = await this.$http.get('categories') 
    if(res.meta.status!==200) 
    return this.$message.error('服务器故障，获取商品数据失败')
   
    this.cateList = res.data
    },
    //请求动态参数或静态属性的数据
    async getParmsData(){
    //如果不是三级分类就将级联选择框内值设置为空;
      if(this.selectedCateKeys.length!==3){
        //如果选择的不是三级分类同时清空动态参数渲染列表
        this.manyTableData=[]
        this.onlyTableData=[]
        return  this.selectedCateKeys=[]
      }
      //所选分类为三级分类，发起数据请求
      const {data:res} = await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes`,{
      params:{sel:this.activeTabName}
      })

      if(res.meta.status!==200) 
         return this.$message.error('服务器繁忙，数据请求失败')
       
       //将attr_val数据字符串格式转换为数组格式
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals ?item.attr_vals.split(" "):[]
          //控制（添加Tag）文本框显示与隐藏，
          item.addTagVisible=false
          //（添加Tag）文本框中输入的值
          item.addTagInputValue=''
       })
        // 判断当前获取的数据是参数还是属性
        if(this.activeTabName==="many") {
           this.manyTableData = res.data
        } else {
           this.onlyTableData = res.data
        }
   },
   //级联选择框内值变化触发这个事件
    async selectedCateChange(){  
    this.getParmsData()
   },
    //tab栏按钮点击触发这个事件
    TabClick(){
    this.getParmsData()
    },
    //顶部添加属性按钮
    btnAddAttributes(){
      this.addParamsFormVisible=true;
    },
    //顶部添加参数按钮,点击显示添加对话框
    btnAddParam(){
      this.addParamsFormVisible=true;
    },
    //添加动态参数或静态属性
    addParamsFormData(){
     this.$refs.addParamsForm.validate(async valid=>{
         if(!valid) 
         return this.$message.error('提交数据不符合规范!')
     
        const {data:res} = await this.$http.post(`categories/${this.selectedCateKeys[2]}/attributes`,{
          attr_name:this.addParamsForm.attr_name,
          attr_sel:this.activeTabName
        })
        if(res.meta.status!==201)
        return this.$message.error('数据添加失败')

       //刷新页面参数数据
        this.getParmsData()
        this.addParamsFormVisible = false
     })
    },
    //监听添加参数按钮关闭事件
    addParamsFormClose(){
    //添加对话框关闭清空表单数据
     this.$refs.addParamsForm.resetFields()
    },
    //编辑属性参数按钮,点击显示编辑对话框
    async showEditDialog(Id){
         this.editParamsFormVisible=true;
         const {data:res} = await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes/${Id}`,{
          attr_sel:this.activeTabName
        })
     
        if(res.meta.status!==200)
        return this.$message.error('数据请求失败') 
        //  数据请求成功，将数据赋值给表单编辑框
        this.editParamsForm=res.data
    },
    //监听编辑参数按钮关闭事件
    editParamsFormClose(){
    //编辑对话框关闭清空表单数据
     this.$refs.editParamsForm.resetFields()
    },
    //编辑动态参数或静态属性
    editParamsFormData(){
     this.$refs.editParamsForm.validate(async valid=>{
         if(!valid) 
         return this.$message.error('提交数据不符合规范!')
     
        const {data:res} = await this.$http.put(`categories/${this.selectedCateKeys[2]}/attributes/${this.editParamsForm.attr_id}`,{
          attr_name:this.editParamsForm.attr_name,
          attr_sel:this.activeTabName
        })
        console.log(res);
        if(res.meta.status!==200)
        return this.$message.error('数据添加失败')

       //刷新页面参数数据
       this.$message.success('数据修改成功')
        this.getParmsData()
        this.editParamsFormVisible = false
     })
    },
    //删除动态参数或静态属性
  async deleteParamsData(Id){
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err);

      if(confirmResult==='cancel') return this.$message.info('已取消删除')
   
    const {data:res} = await this.$http.delete(`categories/${this.selectedCateKeys[2]}/attributes/${Id}`)
    if(res.meta.status!==200) 
    return this.$message.error('删除失败')

    //刷新页面参数数据
    this.getParmsData()
    this.$message.success('删除成功')
 },
   //显示添加tag的输入框
   showAddTagInput(row){
    row.addTagVisible=true
    //让文本框自动获得焦点
    //$nextTick方法的作用:就是当页面上元素被重新渲染之后，
    //才会执行回调函数中的代码(页面渲染是异步的，如果在输入框dom未渲染完毕之前直接使用input.focus()，可能引起报错)
    this.$nextTick(_ => {
          this.$refs.addTagInput.$refs.input.focus();
        });
   },
   //文本框失去焦点或者按下Enter都会触发；触发添加tag事件,发起请求提交数据
   async addTagInputConfirm(row){
     //判断用户输入信息是否有效
       if(row.addTagInputValue.trim().length===0){
         console.log(row.addTagInputValue);
         row.addTagInputValue='';
         row.addTagVisible=false
         return
       }
        //将用户输入的有效信息添加入attr_vals
        row.attr_vals.push(row.addTagInputValue.trim())
        this.saveAddTagInput(row)
   
},
   //保存修改（增删）的tag信息
    async saveAddTagInput(row){
         const {data:res} = await this.$http.put(`categories/${this.selectedCateKeys[2]}/attributes/${row.attr_id}`,{
         attr_name:row.attr_name,
         attr_sel:this.activeTabName,
         attr_vals:row.attr_vals.join(' ')
       })
       console.log(res);
       if(res.meta.status!==200){
         row.addTagInputValue = ''
         row.addTagVisible = false
         return this.$message.error('数据信管失败')
       }
        //刷新页面参数数据
       this.$message.success('数据修改成功')
       row.addTagInputValue = ''
       row.addTagVisible = false
    },
   //移除Tag标签
    removeParamsTag(index,row) {
      row.attr_vals.splice(index,1)
      this.saveAddTagInput(row)
    }
},
computed:{
  //判断添加参数按钮是否禁用
  tabIsDisabled() { 
    //级联选择框未选择三级分类tab选项卡按钮禁用
    if(this.selectedCateKeys.length!==3){
       return true   
    }
    //级联选择框选择三级分类；tab选项卡按钮解除禁用
      return false
  },
  //判断当前对话框为动态参数还是静态属性
  FormDataType() {
    if(this.activeTabName==='many'){
       return '动态参数'   
    }
    //级联选择框选择三级分类；tab选项卡按钮解除禁用
       return '静态属性'
  },
  }
}



</script>

<style scoped lang="less">
.selectCate {
  margin: 20px 0;

  span {
    margin-right: 20px;
  }
}

.el-tag {
margin: 5px;
}

.addTagInput {
 width: 150px;
}
</style>