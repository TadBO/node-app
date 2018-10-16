/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 * 项目的入口文件
 */
//加载express模块 web应用的核心模块
const express = require('express');
//加载模板swig模块
const swig = require('swig');
//加载数据库模块
const mongoose = require('mongoose');
//加载body-parser模块用来处理post请求参数
const bodyParser = require('body-parser');
//加载cookie模块用于用户登录状态处理
const cookies = require('cookies');
//引入数据模型
const User = require('./models/User');
//创建app应用
const app = express();

//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));

//配置模板引擎
//定义当前应用所应用的的模板引擎
//app.engine(name, function)第一个参数为模板引擎的方法第二个参数为用来解析处理模板内容的方法
app.engine('html', swig.renderFile);
//app.set('views', path)设置模板文件存放的目录，第一个参数必须为views，第二个目录为存放模板的路径
app.set('views', './views');
//app.set('view engine', name)注册所使用的模板引擎，第一个参数必须是view engine,第二个参数为app.engine中定义的模板引擎的名称
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});


// app.get('/', (req, res, next) => {
//     // res.send('<h1>welcome my app</h1>');
//     /**
//      * 读取views目录下指定的文件，解析并返回给客户端
//      * 第一个参数： 表示模板文件，相对于views目录
//      * 第二个参数： 传递给模板使用的数据
//      */
//     res.render('index');
// });

//配置body-parser模块
app.use(bodyParser.urlencoded({extended: true}));

//配置设置cookies
app.use((req, res, next) => {
    req.cookies = new cookies(req, res);
    req.userinfo = {};
    if (req.cookies.get('userinfo')) {
        try {
            req.userinfo = JSON.parse(req.cookies.get('userinfo'));
            User.findById(req.userinfo._id).then((user) => {
                req.userinfo.type = user.type;
                next();
            })
        }catch(e) {
            console.log(e);
            next()
        }
    } else {
        next();
    }
});

/**
 * 根据不同的功能划分不同的模块
 */
app.use('/', require('./routers/main'));
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));



//连接数据库
//第一个参数连接的协议
mongoose.connect('mongodb://localhost:27017/myapp', (err) => {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        //监听http请求
        app.listen(3000, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('服务启动成功');
            }
        });
    }
});
