/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 *
 * 前台展示页面的路由
 */

const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    console.log(req.userinfo);
    res.render('main/index', {
        userinfo: req.userinfo
    });
});









module.exports = router;