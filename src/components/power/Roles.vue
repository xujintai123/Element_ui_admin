<template>
  <div id="roles">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" class="expand-table">
          <template slot-scope="scope">
            <el-row
              :class="['bd-bottom',index===0?'bd-top':'']"
              :gutter="20"
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级菜单 -->
              <el-col :span="6">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二三级菜单 -->
              <el-col :span="18">
                <el-row
                  :class="[index!==0?'bd-top':'']"
                  v-for="(item2,index) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <!-- 通过for循环渲染二级权限 -->
                    <el-tag closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <!-- 通过for循环渲染三级权限 -->
                    <el-tag
                      @close="removeRightById(item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-share" size="mini">分配权限</el-button>
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
    roleList:[]
  }
},
created(){
   this.getRoleList()
},
methods:{
  //请求数据方法
  //请求RoleList数据
  async getRoleList(){
  const {data:res} =await this.$http.get('roles')
  console.log(res);

  if(res.meta.status!=200){
   return this.$message.error('获取数据失败，服务器繁忙')
  }
  
  this.roleList=res.data
  console.log(this.roleList);
},

//取消三级权限
 async removeRightById(id){
 const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error);
         if(result!='confirm') 
         return  this.$message.info('已取消删除!');     

          this.$message.success('删除成功!');

        
        
}
}
}
</script>

<style  lang="less" scoped>

.el-tag {
  margin: 9px 5px;
}

.bd-top {
  border-top:1px solid #eee;
}

.bd-bottom {
  border-bottom:1px solid #eee;
}




</style>