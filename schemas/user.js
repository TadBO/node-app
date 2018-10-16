/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 * 创建用户表结构
 */

const mongoose = require('mongoose');

//用户表结构
module.exports = new mongoose.Schema({
    //每一个属性就是一个字段
    //用户名
    username: String,
    //密码
    password: String,
    //是否为管理员
    type: {
        type: Number,
        default: 1,  //0为管理员，1为普通用户
    }
});