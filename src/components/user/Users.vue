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
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <!-- 索引列 -->
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="日期" prop="create_time" width="200" align="center"></el-table-column>
      <el-table-column label="用户名" prop="username" width="200" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="200" align="center"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="200" align="center"></el-table-column>
      <el-table-column label="角色" prop="role_name" width="200" align="center"></el-table-column>
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
            <el-button type="success" icon="el-icon-edit" size="small" @click="modifyUserById(scope.row.id)">
            </el-button>
          </el-tooltip>
          <!-- 分配角色按钮 -->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="primary" @click="setRole(scope.row)" icon="el-icon-share" size="small"></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[ 5, 10, 20]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <!-- 添加用户的dialog对话框 -->
    <el-dialog center title="添加用户" :visible.sync="addUserDialog" @close="addDialogClosed" width="50%">
      <!-- 内容主题区域 -->
      <el-form label-width="80px" ref="addFormRef" :rules="addFormRules" :model="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的dialog对话框 -->
    <el-dialog center title="修改用户信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="50%">
      <!-- 内容主题区域 -->
      <el-form label-width="80px" ref="editFormRef" :rules="addFormRules" :model="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的dialog对话框 -->
    <el-dialog center class="el-dialog-setRole" @close="closeSetRoleDialog" title="分配角色"
      :visible.sync="setRoleDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <div class="fatherSetRole">
        <div class="setRole">
          <div>当前用户：{{userInfo.username}}</div>
          <div>当前角色：{{userInfo.role_name}}</div>
          <!-- slect选择器 -->
          <div>
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.roleDesc">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="modifyRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
          //合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      };

      //验证手机号的规则
      var checkMoile = (rule, value, cb) => {
        //验证手机号的正则表达式
        const regMoile = /^1[3-9]\d{9}$/;
        if (regMoile.test(value)) {
          //合法的手机号
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      };



      //获取用户列表的参数对象
      return {
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 每页显示的数据数量
          pagesize: 10
        },
        userList: [],
        total: 0,
        //控制添加用户dialog对话框显示隐藏
        addUserDialog: false,
        //控制修改用户dialog对话框显示隐藏
        editDialogVisible: false,
        //控制分配角色dialog对话框显示隐藏
        setRoleDialogVisible: false,

        //添加用户的表单数据、规则
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        //查询到的用户信息对象
        editForm: {},
        addFormRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度在1到10个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMoile,
              trigger: 'blur'
            }
          ],
        },
        //当前需要分配角色的用户信息
        userInfo: '',
        //当前需要分配的角色列表
        roleList: '',
        // 已选中的角色id
        selectedRoleId: ''
      }
    },
    created() {
      console.log('user页面created');
      this.getUserList()
    },
    destroyed() {
      console.log('user页面destroyed');
    },
    activated() {
      console.log('user页面activated');
    },
    deactivated() {
      console.log('user页面deactivated');
    },
    methods: {
      // 数据请求
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败')
        this.userList = res.data.users
        this.total = res.data.total
        // console.log(this.userList);
      },
      // 监听事件  监听pagesize改变（每页的数据数量）
      handleSizeChange(newSum) {
        this.queryInfo.pagesize = newSum
        this.getUserList()
      },
      // 监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      //监听switch开关状态改变
      async userStateChange(userInfo) {
        const {
          data: res
        } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        console.log(res);
        this.$message.success('更新用户状态成功')
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //监听编辑用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //点击确定按钮添加用户预验证，添加新用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            //发起添加用户请求
            const {
              data: res
            } = await this.$http.post('users', this.addForm)
            console.log(res);
            if (res.meta.status !== 201) {
              //添加用户失败
              const msg = res.meta.msg
              return this.$message({
                message: msg,
                center: true,
                type: 'error',
                duration: 1500
              });
            }
            //添加用户成功,隐藏dialog对话框
            this.addUserDialog = false
            //重新获取用户列表数据
            this.getUserList()
            this.$message({
              message: '用户添加成功',
              center: true,
              type: 'success',
              duration: 1500
            });
          } else {
            return
          }
        });
      },
      //修改用户信息(获取信息)
      async modifyUserById(id) {
        this.editDialogVisible = true
        //根据用户id查询用户信息
        const {
          data: res
        } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
        this.editForm = res.data
        console.log(res);
      },
      //点击确定按钮编辑用户信息预验证，提交编辑用户信息
      editUser() {
        this.$refs.editFormRef.validate(async vaild => {
          if (!vaild) {
            return this.$message.error('用户信息不符合规范')
          }
          const {
            data: res
          } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 200) {
            return this.$message.error('服务器繁忙，用户信息更新失败')
          }
          //更改用户信息成功
          this.editForm = res.data
          this.$message.success('用户信息更改成功')
          this.editDialogVisible = false
          //刷新页面数据
          this.getUserList()
        })
      },
      //根据id删除用户信息
      async removeUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //取消删除操作
        if (confirmResult === 'cancel')
          return this.$message({
            type: 'info',
            message: '已取消删除'
          });

        //确定删除操作
        const {
          data: res
        } = await this.$http.delete(`users/${id}`, {
          id: id
        })

        if (res.meta.status !== 200) {
          return this.$message.error('服务器繁忙，删除失败!')
        }

        this.$message.success('删除用户成功')
        //更新页面数据
        this.getUserList()
      },
      //分配角色按钮
      async setRole(userInfo) {
        this.setRoleDialogVisible = true
        this.userInfo = userInfo
        //获取角色列表
        const {
          data: res
        } = await this.$http.get('roles')

        if (res.meta.status !== 200) return this.$message.error('服务器繁忙，获取角色数据失败')

        this.roleList = res.data
      },
      //点击按钮 修改用户角色
      async modifyRole() {
        if (!this.selectedRoleId)
          return this.$message.error('请选择需要分配的角色信息')

        const {
          data: res
        } = await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })

        if (res.meta.status !== 200) return this.$message.error('修改角色失败')

        this.$message.success("修改角色成功")
        this.setRoleDialogVisible = false
      },

      //监听分配角色页面关闭事件，关闭清空页面数据
      closeSetRoleDialog() {
        this.selectedRoleId = ''
      }



    }
  }

</script>

<style lang="less" scoped>
  .el-dialog {
    display: flex;
    align-items: center;

    .el-form {
      width: 80%;
    }

  }

  .fatherSetRole {
    display: flex;
    justify-content: center;
    text-align: center;

    .setRole {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 70%;

      div {
        margin-top: 10px;
      }

    }
  }

</style>
