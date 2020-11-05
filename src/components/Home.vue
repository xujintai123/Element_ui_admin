<!--
 * @Author: xujintai
 * @Date: 2020-11-05 15:50:40
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 16:09:08
 * @Description: 文件说明
-->
<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
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
        }
}

}
</script>

<style  lang="less" scoped >

</style>