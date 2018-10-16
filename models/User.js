/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 *
 * 用户表模型
 */

const mongoose = require('mongoose');
const userSchemas = require('../schemas/user');

module.exports = mongoose.model('User', userSchemas);