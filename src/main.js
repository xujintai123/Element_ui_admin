/*
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:12
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 15:12:50
 * @Description: 文件说明
 */

// 引入外部包
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import TableTree from 'vue-table-with-tree-grid'

//引入自定义API
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios

Vue.component('TableTree', TableTree)


Vue.config.productionTip = false


// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
