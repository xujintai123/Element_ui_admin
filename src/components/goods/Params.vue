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
          <el-button type="primary" :disabled="tabIsDisabled">添加属性</el-button>

          <!-- 动态参数的表格 -->
          <el-table border :data="manyTableData" stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
            <el-table-column align="center" prop="attr_name" label="参数名称" width="600"></el-table-column>
            <el-table-column align="center" label="操作" width="600">
              <!-- 模板插槽 -->
              <template scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的模板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" :disabled="tabIsDisabled">添加参数</el-button>

          <!-- 静态属性的表格 -->
          <el-table border :data="onlyTableData" stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
            <el-table-column align="center" prop="attr_name" label="属性名称" width="600"></el-table-column>
            <el-table-column align="center" label="操作" width="600">
              <!-- 模板插槽 -->
              <template scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
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
        return  this.selectedCateKeys=[]
      }
      //所选分类为三级分类，发起数据请求
      const {data:res} = await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes`,{
      params:{sel:this.activeTabName}
      })
console.log(res);
      if(res.meta.status!==200) 
         return this.$message.error('服务器繁忙，数据请求失败')
      
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
    }
},
computed:{
  tabIsDisabled(){ 
//return this.selectedCateKeys.length===3?false:true
    //级联选择框未选择三级分类tab选项卡按钮禁用
    if(this.selectedCateKeys.length!==3){
       return true   
    }
    //级联选择框选择三级分类；tab选项卡按钮解除禁用
      return false
  }
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
</style>