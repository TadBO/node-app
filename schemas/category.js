/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 * 创建分类表结构
 */

const mongoose = require('mongoose');

//分类表结构
module.exports = new mongoose.Schema({
    //每一个属性就是一个字段
    //分类名称
    name: String,
    createTime: {
        type: Date,
        default: new Date()
    }
});