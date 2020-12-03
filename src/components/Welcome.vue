<template>
  <div id="welcome">
    <div v-if="isLoading">Loading......</div>
    <button @click="setHeader">按钮</button>
    <!-- <keep-alive>  </keep-alive> -->
    <test-one v-show="isShow"> </test-one>

  </div>
</template>

<script>
  //测试设置请求头、设置响应头
  import axios from 'axios'

  import TestOne from 'components/test/TestOne'
  export default {
    data() {
      return {
        isLoading: false,
        isShow: false
      }
    },
    components: {
      TestOne
    },
    //打印顺序为6,3,7,8,1,2,9；说明axios拦截器只有在发起axios请求才会触发（axios拦截器是异步的）
    created() {
      axios.interceptors.request.use(config => {
        this.isLoading = true
        // console.log(1);
        return config;
      });
      axios.interceptors.response.use(config => {
        this.isLoading = false
        // console.log(2);
        return config;
      });
      // console.log(6);
    },
    // activated() {
    //   console.log('welcome页面activated');
    // },
    // deactivated() {
    //   console.log('welcome页面deactivated');
    // },
    methods: {
      //监听按钮点击
      setHeader() {
        axios.get('http://119.23.53.78:8888/api/private/v1/menus', console.log(7)).then(res => console.log(9))
        this.isShow = !this.isShow
      }
    }
  }

</script>

<style lang="less" scoped>
  #welcome {
    height: 90vh;
  }

</style>
