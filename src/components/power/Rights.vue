<!--
 * @Author: xujintai
 * @Date: 2020-11-09 08:24:44
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-09 13:51:29
 * @Description: 文件说明
-->
<template>
  <div id="rights">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
  

<script>
export default {
data(){
return {
  //权限列表
 rightsList:[]
}
},
created(){
  //获取所有权限
  this.getRightsList()
},
methods:{
  async getRightsList(){
  const {data:res} =  await this.$http.get('rights/list')
    if(res.meta.status!==200){
      return this.$message.error('服务器繁忙，获取数据失败')
    }

    this.rightsList=res.data
    // console.log(this.rightsList);
  }
}
}
</script>

<style  lang="less" scoped>

</style>