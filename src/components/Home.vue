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
      <div class="header-img">
        <img src="~assets/img/hzw.jpg" alt />
        <span>CodeXJT</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="(isCollapse?'45px':'200px')">
        <el-menu router :collapse-transition="false" :collapse="isCollapse" unique-opened background-color="#333744"
          text-color="#fff" active-text-color="#409BFF" :default-active="activePath">
          <div class="close" @click="closeMenu">
            <i class="el-icon-d-caret"></i>
          </div>
          <!-- 一级菜单  循环遍历menusData(每个item)-->
          <el-submenu :index="item.id+''" v-for="item in menusData" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单  循环遍历(item的children数组) -->
            <el-menu-item :index="'/'+children.path" v-for="children in item.children" :key="children.id"
              @click=" saveNavState">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{children.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        //左侧菜单数据
        menusData: null,
        //一级菜单图标
        icons: {
          125: 'el-icon-s-custom',
          103: 'el-icon-s-grid',
          101: 'el-icon-s-cooperation',
          102: 'el-icon-s-order',
          145: 'el-icon-s-platform'
        },
        //折叠菜单栏
        isCollapse: false,
        activePath: ''
      }
    },
    //生命周期函数
    created() {
      //获取侧边栏数据
      this.getMenusData();
    },
    methods: {
      logout() {
        //清空token
        window.sessionStorage.clear()
        //跳转到登录页
        this.$router.push('/login')
        this.$message({
          message: '退出登录',
          center: true,
          type: 'success',
          duration: 1500
        });
      },

      //折叠左侧菜单栏
      closeMenu() {
        this.isCollapse = !this.isCollapse
      },
      //获取当前活跃的route
      saveNavState(path) {
        this.activePath = this.$route.path
      },


      //获取接口数据方法
      getMenusData() {
        this.$http.get('menus').then(res => {
          const data = res.data
          //侧边栏数据请求成功;赋值给menusData
          if (data.meta.status === 200) {
            this.menusData = data.data
          }
          //数据请求失败
          else {
            this.$message({
              message: '服务器繁忙',
              center: true,
              type: 'error',
              duration: 1500
            });
          }
        })
      }
    },

  }

</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
    width: 100%;
    overflow: hidden;

    .el-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      ;
      background-color: #373D41;

      .header-img {
        display: flex;
        justify-content: space-between;
        ;
        align-items: center;
        height: 100%;
        width: 140px;
        color: white;
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

      //el-menu默认有一个1px的border-right右边框，将它取消掉
      .el-menu {
        height: 100%;
        border-right: none;

        .close {
          line-height: 50px;
          text-align: center;
          color: white;
          height: 6%;
        }
      }
    }

    .el-main {
      background-color: #EAEDF1;
    }
  }

</style>
