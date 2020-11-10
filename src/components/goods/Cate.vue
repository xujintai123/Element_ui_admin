<template>
  <div id="cate">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary">添加分类</el-button>

      <!-- 表格区域 -->
      <el-table :data="cateList" border stripe style="width: 100%">
        <el-table-column align="center" type="index" label="#" width="40"></el-table-column>
        <el-table-column align="center" prop="cat_name" label="分类名称" width="350"></el-table-column>
        <el-table-column align="center" prop="cat_deleted" label="是否有效" width="350"></el-table-column>
        <el-table-column align="center" prop="address" label="排序" width="350"></el-table-column>
        <el-table-column align="center" prop="address" label="操作" width="350"></el-table-column>
      </el-table>

      <!-- 页码区域 -->
    </el-card>
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
        pagenum:1,
        pagesize:20
      },
      // 商品总页数
      total:''
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
    this.total=res.data.total
    }
  }


}
</script>

<style>

</style>