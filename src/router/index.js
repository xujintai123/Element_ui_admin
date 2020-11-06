/*
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:14
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 16:07:46
 * @Description: 文件说明
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

// 子路由
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home/',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
    ]
  },

]



const router = new VueRouter({
  routes
})


//路由导航守卫
//前置导航守卫
router.beforeEach((to, from, next) => {
  //目标页面为login，直接放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，强制跳转登录页面
  if (!tokenStr) return next('/login')
  next()
})


export default router
