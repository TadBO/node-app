/**
 * @Author: Tuber
 * @Date: 2018/10/12
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/12
 * 内容部分的模型
 */

const mongoose = require('mongoose');
const contentSchemas = require('../schemas/content');

module.exports = mongoose.model('Content', contentSchemas);