/*
 * @Author: xujintai
 * @Date: 2020-11-05 15:06:56
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 15:10:34
 * @Description: 文件说明
 */
import axios from 'axios'

const http = axios.create({
    timeout: 1000 * 30,
    baseURL: 'http://119.23.53.78:8888/api/private/v1/',
    // withCredentials: true,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8'
    // }
  })

  export default http