<!--
 * @Author: xujintai
 * @Date: 2020-11-05 15:50:40
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 17:29:50
 * @Description: 文件说明
-->
<template>
  <el-container>
    <!-- 页面头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/hzw.jpg" alt="">
        <span>CodeXJT</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <!-- 右侧内容 -->
      <el-main>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
methods:{
    logout(){
        //清空token
        window.sessionStorage.clear()
        //跳转到登录页
        this.$router.push('/login/')
        this.$message({
                      message: '退出登录',
                      center: true,
                      type:'success',
                      duration:1500
                    });
        },
       //侧边菜单栏
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
}

}
</script>

<style lang="less" scoped >
  .el-container {
   height: 100%;
   width: 100%;
   
    .el-header {
     display: flex;
     align-items: center;
     justify-content: space-between; ;
     background-color: #373D41;  

     div {
       display: flex;
       justify-content: space-between; ;
       align-items: center;
       height: 100%;
       width: 140px;
       color:white;
       font-size: 18px;
       img {
           border-radius: 10px;
           height: 90%;
       }
     }

     .el-button {
            height: 70%;
     }
     }

    .el-aside {
     background-color: #333744;  
     }
     
    .el-main {
     background-color: #EAEDF1;  
     }
}


</style>