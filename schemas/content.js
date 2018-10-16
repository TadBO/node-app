/**
 * @Author: Tuber
 * @Date: 2018/10/12
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/12
 * 内容管理的表结构
 */

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //关联字段 -内容分类的id
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    //内容标题
    title: String,
    //简介
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    //关联用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //点击量，阅读量
    views: {
        type: Number,
        default: 0
    }

});