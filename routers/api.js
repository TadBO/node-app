/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 *
 * ajax请求相关的路由
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category')
//统一的返回格式
let responseData;
router.use((res,req,next) => {
    responseData = {
        code: 0,
        message: ''
    };
    next();
})
router.get('/user', (req, res, next) => {
    res.send('api');
});

/**
 * 注册逻辑
 * 1.用户名，密码不能为空
 * 2.用户是否被注册
 */
router.post('/user/register', (req, res, next) => {
    // console.log(req.body);
    let username = req.body.username,
        password = req.body.password;
    if (username === '') {
        responseData.code = 1;
        responseData.message = '用户名称不能为空';
        res.json(responseData);
        return;
    }
    if (password === '') {
        responseData.code = 1;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //数据库验证，是否用户名被注册过
    User.findOne({
        username: username
    }).then((info) => {
        console.log(info);
        if (info) {
            responseData.code = 2;
            responseData.message = '用户名已被注册';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库
        let user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then((info) => {
        console.log(info);
        responseData.message = '注册成功';
        res.json(responseData);
    });



});

/**
 * 用户登录逻辑
 */
router.post('/user/login', (req, res, next) => {
   let username = req.body.username,
       password = req.body.password;
   if (username === '' || password == '') {
       responseData.code = 1;
       responseData.message = '用户名或密码不能为空';
       res.json(responseData);
       return;
   }
   //数据库校验用户是否注册过并允许登陆
   User.findOne({
       username: username,
       password: password
   }).then((info) => {
       if(!info) {
           responseData.code = 3;
           responseData.message = '用户名或密码错误';
           res.json(responseData);
           return;
       }
       responseData.message = '登陆成功';
       responseData.userInfo = {
           _id: info._id,
           username: info.username,
           type: info.type
       }
       req.cookies.set('userinfo', JSON.stringify({
           _id: info._id,
           username: info.username,
           type: info.type
       }));
       res.json(responseData);
   });
});


/**
 * 用户退出逻辑
 * @type {Router|router}
 */
router.get('/user/logout', (req, res, next) => {
    req.cookies.set('userinfo', null);
    res.json(responseData);
});

/**
 * 分类列表逻辑
 * @type {Router|router}
 */
router.get('/category', (req, res, next) => {
    Category.find().sort({_id: -1}).then((categorys) => {
        responseData.data = categorys;
        res.json(responseData);
    })
})








module.exports = router;