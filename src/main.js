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
//导入tableTree
import TableTree from 'vue-table-with-tree-grid'
//导入富文本编辑
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//引入自定义API
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios



Vue.component('TableTree', TableTree)

//将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor, /* { default global options } */)




// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法


// filter全局过滤器 前面是名字，后面是函数
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
