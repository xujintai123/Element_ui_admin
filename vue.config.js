/*
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:10
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-05 15:00:36
 * @Description: 文件说明
 */

const path = require("path"); //引入path模块

function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("static", resolve("./static"))
      .set("@", resolve("./src"))
      .set("components", resolve("./src/components"))
      .set("views", resolve("./src/views"))
      .set("assets", resolve("./src/assets"));
    //set第一个参数：设置的别名，第二个参数：设置的路径
  }
};
