<!--
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:14
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 16:56:46
 * @Description: 文件说明
-->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box ">
        <img src="~assets/img/hzw.jpg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="FormData" status-icon :rules="dataRules" ref="LoginForm">
        <!-- 用户名区域 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" placeholder="请输入用户名" v-model="FormData.username"></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" v-model="FormData.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitLoginForm('LoginForm')">登录</el-button>
          <el-button type="info" @click="resetLoginForm('LoginForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
data(){
    return {
        //登录表单的数据对象
         FormData: {
         username: 'admin',
         password: '123456',
        },
        //表单的数据验证规则对象
        dataRules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在5到10个字符', trigger: 'blur' }
          ],
         password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在5到10个字符', trigger: 'blur' }
          ],
        }
      };
    },
    
methods: {
      //提交表单
      submitLoginForm(formName) {
        this.$refs[formName].validate((valid) => {
         //valid 验证成功
          if (valid) {
         //发起登录请求
         this.$http.post('login',this.FormData)
         .then(res=>{
             console.log(res);
             const data=res.data
             //状态码200 登录成功
             if(data.meta.status===200){
             //登录成功，保存token到sessionStorage
               window.sessionStorage.setItem('token',data.data.token)  
             //登录成功以后,跳转到home页面
               this.$router.push('/home')
               return  this.$message({
                      message: '登录成功',
                      center: true,
                      type:'success',
                      duration:1500
                });
             }
             //否则登录失败
              this.$message({
                      message: '登录失败',
                      center: true,
                      type:'error',
                      duration:1500
                });
         }); 
      }

        //valid 验证失败
           else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置表单
      resetLoginForm(formName) {
        this.$refs[formName].resetFields();
        console.log(this);
      }
    }
}
</script>

<style  lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
//   font-style: italic;
  font-size: 20px;

  .login_box { 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 400px;
    width: 600px;
    background-color: white;
    border-radius: 3px;
    
    .avatar_box {
    position: relative;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #eee;
    height: 180px;
    width: 180px;
    border:10px solid white; 
    padding: 5px;
    border-radius:50%;
    box-shadow: 3px 3px 3px 2px rgba(0, 0, 0, 0.2);
     img {
         width:100%;
         height:100%;
         border-radius:50%;
     }
    } 
  }
}

.el-form{
    position: relative;
    bottom: 30%;
    height: 60%;
    width: 100%;
    padding: 13%;
    // border-box盒子content 包含padding
    box-sizing: border-box;
 .btns{
    display: flex;
   justify-content: flex-end;
}   

}


</style>