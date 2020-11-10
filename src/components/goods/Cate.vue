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
      <!-- <el-table :data="cateList" border stripe style="width: 100%">
        <el-table-column align="center" type="index" label="#" width="40"></el-table-column>
        <el-table-column align="center" prop="cat_name" label="分类名称" width="350"></el-table-column>
        <el-table-column align="center" prop="cat_deleted" label="是否有效" width="350"></el-table-column>
        <el-table-column align="center" prop="address" label="排序" width="350"></el-table-column>
        <el-table-column align="center" prop="address" label="操作" width="350"></el-table-column>
      </el-table>-->

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
      total:'',
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
    console.log(this.cateList);
    this.total=res.data.total
    }
  }


}
</script>

<style scoped lang="less">
 .table-tree {
   margin-top: 20px;
 }
</style>