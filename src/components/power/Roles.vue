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
            <el-row :class="['bd-bottom',index===0?'bd-top':'']" :gutter="20" v-for="(item1,index) in scope.row.children" :key="item1.id">
              <!-- 渲染一级菜单 -->
              <el-col :span="6">
                <el-tag @close="removeRightById(item1.id,scope.row)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二三级菜单 -->
              <el-col :span="18">
                <el-row :class="[index!==0?'bd-top':'']" v-for="(item2,index) in item1.children" :key="item2.id">
                  <el-col :span="8">
                    <!-- 通过for循环渲染二级权限 -->
                    <el-tag @close="removeRightById(item2.id,scope.row)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <!-- 通过for循环渲染三级权限 -->
                    <el-tag @close="removeRightById(item3.id,scope.row)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
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
            <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-share" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 展示分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync=" SetRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :default-checked-keys="defKeys" :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id"></el-tree>
      <span slot="footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
export default {
data(){
  return {
    //角色信息
    roleList:[],
    //展示分配权限的对话框
    SetRightDialogVisible:false,
    //所有权限的数据
    rightsList:[],
    //树形控件的属性绑定对象
    treeProps:{
        label:'authName',
        //父子节点通过哪个属性进行嵌套
        children:'children'
    },
    // 默认选中的节点id值数组
    defKeys:[],
    //点击分配权限按钮保存角色id
    roleId:''
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
//   console.log(res);

  if(res.meta.status!=200){
   return this.$message.error('获取数据失败，服务器繁忙')
  }
  
  this.roleList=res.data
//   console.log(this.roleList);
},

//取消权限
 async removeRightById(RightId,Role){
 const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error);
         if(result!='confirm') 
         return  this.$message.info('已取消删除!');     

         const {data:res}= await this.$http.delete(`roles/${Role.id}/rights/${RightId}`)
         if(res.meta.status !==200){
             return  this.$message.error('删除权限失败，服务器繁忙')
         }

        this.$message.success('删除成功!');
         //返回数据中的data中为最新的数据，赋值给Role.children；刷新页面数据
        Role.children=res.data     
},

//展示分配权限的对话框
async  showSetRightDialog(role){ 
   //保存当前打开的角色id
    this.roleId=role.id
   //请求分配权限的数据（删除操作）
  const {data:res}=await this.$http.get(`rights/tree`)
    if(res.meta.status!=200) return  this.$message.error('删除权限失败，服务器繁忙')

   //将获取到的权限数据保存到data中
    this.rightsList=res.data
    // console.log(this.rightsList);

    //递归将三级权限数据id保存到defKeys中
    this.defKeys=[]
    this.getLeafKeys(role,this.defKeys)

    //显示分配权限的对话框
    this.SetRightDialogVisible=true

    },
//通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
   getLeafKeys(node,arr){
       //如果当前node节点不包含children属性，则是三级节点
       if(!node.children){
          return arr.push(node.id) 
       }
      //如果当前node节点包含children属性，则不是三级节点，继续递归
       node.children.forEach(item=>
       this.getLeafKeys(item,arr))
   },
   //点击确定按钮提交分配权限的数据，post请求
   async allotRights(){
        //获取当前选中的全部节点
        const keys = [
          ...this.$refs.treeRef.
          getCheckedKeys(),
          ...this.$refs.treeRef.
          getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')

        //发起post请求，更新选中的节点信息
        const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

        if(res.meta.status!==200) 
        return this.$message.error('服务器繁忙,分配权限失败')
       
         this.$message.success("分配权限成功")
         //刷新数据
         this.getRoleList() 
         
         //关闭分配期限的对话框
         this.SetRightDialogVisible = false
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