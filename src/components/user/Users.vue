<template>
  <div id="users">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡牌视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList(queryInfo.query)"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <!-- 索引列 -->
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="日期" prop="create_time" width="180" align="center"></el-table-column>
      <el-table-column label="用户名" prop="username" width="180" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="180" align="center"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="180" align="center"></el-table-column>
      <el-table-column label="角色" prop="role_name" width="180" align="center"></el-table-column>
      <el-table-column label="状态" width="180" align="center">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
            <el-button type="success" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <!-- 分配角色按钮 -->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-share" size="small"></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户的dialog对话框 -->
    <el-dialog :model="addForm" title="添加用户" :visible.sync="dialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form label-width="80px" ref="dialogForm" :rules="addFromRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
 //获取用户列表的参数对象
    return {
      queryInfo:{
      query:'',
      // 当前的页数
      pagenum:1,
      // 每页显示的数据数量
      pagesize:2
    },
    userList:[],
    total:0,
    //控制添加用户dialog对话框显示隐藏
    dialogVisible:false,
    //添加用户的表单数据、规则
    addForm:{
      username:'',
      password:'',
      email:'',
      mobile:'',
    },
     addFromRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
           email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
              mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
 }
  },
  created(){
    this.getUserList()
  },
  methods:{
    // 数据请求
   async  getUserList(){
    const {data:res} = await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status!==200) return this.$message.error('获取用户列表数据失败')
      this.userList=res.data.users
      this.total=res.data.total
      // console.log(this.userList);
    },
    // 监听事件  监听pagesize改变（每页的数据数量）
    handleSizeChange(newSum){
      this.queryInfo.pagesize=newSum
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
       this.queryInfo.pagenum=newPage
       this.getUserList()
    },
    //监听switch开关状态改变
   async userStateChange(userInfo){
   const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
    if(res.meta.status!==200)
    { 
     userInfo.mg_state=!userInfo.mg_state
     return this.$message.error('更新用户状态失败')
     }
     console.log(res);
      this.$message.success('更新用户状态成功')
  },

  }
}
</script>

<style  lang="less" scoped >
.el-dialog {
 display: flex;
 align-items: center;

   .el-form {
     width: 80%;
   }

}

</style>