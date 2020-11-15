/*
 * @Author: xujintai
 * @Date: 2020-11-05 15:06:56
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 17:28:08
 * @Description: 文件说明
 */


//导入NProgress包和对应的css(导航栏顶部加载动画)
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

// axios实例
const http = axios.create({
  timeout: 1000 * 30,
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  // https://www.liulongbin.top:8888/api/private/v1/
  // http://119.23.53.78:8888/api/private/v1/
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json; charset=utf-8'
  // }
})

// axios请求拦截
http.interceptors.request.use(config => {
  //做拦截处理，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在请求拦截器中，展示进度条
  NProgress.start()

  return config;
});

// axios响应拦截
http.interceptors.response.use(config => {
  //在响应拦截器中，隐藏进度条
  NProgress.done()

  return config;
})


export default http