/*
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:14
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 16:07:46
 * @Description: 文件说明
 */
import Vue from 'vue'
import VueRouter from 'vue-router'


import Login from 'components/Login.vue'
import Home from 'components/Home.vue'
// 子路由
import Welcome from 'components/Welcome.vue'
import Users from 'components/user/Users.vue'
import Rights from 'components/power/Rights.vue'
import Roles from 'components/power/Roles.vue'
import Cate from 'components/goods/Cate.vue'
import Params from 'components/goods/Params.vue'
import List from 'components/goods/List.vue'
import Add from 'components/goods/Add.vue'
import Order from 'components/order/Order.vue'
import Report from 'components/report/Report.vue'


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
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
    ]
  },
]


//路由懒加载 （使用路由懒加载进行按需加载）
// const routes = [
//   { path: '/', redirect: '/login' },
//   { path: '/login', component: () => import('components/Login.vue') },
//   {
//     path: '/home/',
//     component: () => import('components/Home.vue'),
//     redirect: '/welcome',
//     children: [
//       { path: '/welcome', component: () => import('components/Welcome.vue') },
//       { path: '/users', component: () => import('components/user/Users.vue') },
//       { path: '/rights', component: () => import('components/power/Rights.vue') },
//       { path: '/roles', component: () => import('components/power/Roles.vue') },
//       { path: '/categories', component: () => import('components/goods/Cate.vue') },
//       { path: '/params', component: () => import('components/goods/Params.vue') },
//       { path: '/goods', component: () => import('components/goods/List.vue') },
//       { path: '/goods/add', component: () => import('components/goods/Add.vue') },
//       { path: '/orders', component: () => import('components/order/Order.vue') },
//       { path: '/reports', component: () => import('components/report/Report.vue') },
//     ]
//   },
// ]



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
