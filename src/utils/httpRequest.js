/*
 * @Author: xujintai
 * @Date: 2020-11-05 15:06:56
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 17:28:08
 * @Description: 文件说明
 */
import axios from 'axios'

// axios实例
const http = axios.create({
  timeout: 1000 * 30,
  baseURL: 'http://119.23.53.78:8888/api/private/v1/',
  // https://www.liulongbin.top:8888/api/private/v1/
  // http://119.23.53.78:8888/api/private/v1/
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json; charset=utf-8'
  // }
})

// axios请求拦截
http.interceptors.request.use(function (config) {
  //做拦截处理，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});


export default http