/**
 * @Author: Tuber
 * @Date: 2018/10/10
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/10
 *
 * 后台管理系统的路由
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Content = require('../models/Content');




router.use((req, res, next) => {
    if (req.userinfo.type !== 0) {
        res.send(null);
        return;
    }
    next();
});
/**
 * 后台管理首页
 */
router.get('/', (req, res, next) => {
    res.render('admin/index', {
        userinfo: req.userinfo
    });
});

/**
 * 后台管理用户管理
 * @type {Router|router}
 */
router.get('/user', (req, res, next) => {
    /**
     * 获取用户的所有数据
     * limit(),限制用户获取数据条数，用于分页
     * skip() 忽略前几条
     */
    let page = Number(req.query.page || 1),
        limit = 2,
        pages = 0;
    User.countDocuments().then((count) => {
        pages = Math.ceil( count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then((users) => {
            res.render('admin/user/user-index', {
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
                url: '/admin/user',
                userinfo: req.userinfo
            });
        });
    });

});

/**
 * 后台管理分类管理
 * 分类首页
 * @type {Router|router}
 * sort 1:升序 -1: 降序
 */

router.get('/category', (req, res, next) => {
    let page = Number(req.query.page || 1),
        limit = 2,
        pages = 0;
   Category.countDocuments().then((count) => {
       pages = Math.ceil( count / limit);
       page = Math.min(page, pages);
       page = Math.max(page, 1);
       let skip = (page - 1) * limit;
       Category.find().sort({_id: -1}).limit(limit).skip(skip).then((categorys) => {
           res.render('admin/category/category-index', {
               categorys: categorys,
               page: page,
               count: count,
               pages: pages,
               limit: limit,
               url: '/admin/category',
               userinfo: req.userinfo
           });
       })
   });
});

/**
 * 后台管理分类管理
 * 分类添加
 * @type {Router|router}
 */

router.get('/category/add', (req, res, next) => {
   res.render('admin/category/category-add', {
       userinfo: req.userinfo
   }) ;
});

/**
 * 分类添加保存接口
 * @type {Router|router}
 */
router.post('/category/add', (req, res, next) => {
    let name = req.body.name,
        errormessage = '分类信息不能为空';
    if (name === '') {
        res.render('admin/error', {
            errormessage: errormessage,
            userinfo: req.userinfo
        });
    }
    Category.findOne({
        name: name
    }).then((info) => {
        if (info) {
            errormessage = '分类信息已存在';
            res.render('admin/error', {
                userinfo: req.userinfo,
                errormessage: errormessage
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then((newCategory) => {
        res.render('admin/success', {
            userinfo: req.userinfo,
            message: '添加成功',
            url: '/admin/category'
        });
    });
});

/**
 * 分类修改
 * @type {Router|router}
 */
router.get('/category/edit', (req, res, next) => {
    let id = req.query.id;
    Category.findOne({
        _id: id
    }).then((category) => {
        category
        if (!category) {
            res.render('admin/error', {
                userinfo: req.userinfo,
                errormessage: '找不到该分类'
            });
            return Promise.reject();
        }
        res.render('admin/category/category-edit', {
            userinfo: req.userinfo,
            category: category
        });
    });
});
/**
 * 分类编辑保存接口
 * @type {Router|router}
 */
router.post('/category/edit', (req, res, next) => {
   let id = req.body.id || '',
       name = req.body.name || '';
    Category.findOne({
       _id: id
   }).then((category) => {
       if (!category ) {
           res.render('admin/error', {
               userinfo: req.userinfo,
               errormessage: '分类信息不存在'
           });
           return Promise.reject();
       } else {
           if (!name) {
               res.render('admin/error', {
                   userinfo: req.userinfo,
                   errormessage: '编辑分类名不能为空'
               });
               return Promise.reject();
           }
           if (name === category.name) {
               res.render('admin/success', {
                   userinfo: req.userinfo,
                   message: '编辑成功',
                   url: '/admin/category'
               });
               return Promise.reject();
           } else {
               return Category.findOne({
                   _id: {$ne: id},
                   name: name
               });
           }
       }
   }).then((sameCategory) => {
      if (sameCategory) {
          res.render('admin/error', {
              userinfo: req.userinfo,
              errormessage: '数据库中已存在相同的分类名称'
          });
          return Promise.reject();
      } else {
          return Category.update({
              _id: id
          }, {
              name: name
          }).then((info) => {
              res.render('admin/success', {
                  userinfo: req.userinfo,
                  message: '编辑成功',
                  url: '/admin/category'
              });
          });
      }
   });
});

/**
 * 分类管理删除操作
 * @type {Router|router}
 */
router.get('/category/delete', (req, res, next) => {
    let id = req.query.id;
    Category.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userinfo: req.userinfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });
});


/**
 * 内容管理内容列表
 * @type {Router|router}
 */
router.get('/content', (req, res, next) => {
    /**
     * 获取用户的所有数据
     * limit(),限制用户获取数据条数，用于分页
     * skip() 忽略前几条
     */
    let page = Number(req.query.page || 1),
        limit = 2,
        pages = 0;
    Content.countDocuments().then((count) => {
        pages = Math.ceil( count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate('category').then((contents) => {
            res.render('admin/content/content-index', {
                contents: contents,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
                url: '/admin/content',
                userinfo: req.userinfo
            });
        });
    });
});


/**
 * 内容管理添加内容页面
 * @type {Router|router}
 */
router.get('/content/add', (req, res, next) => {
    Category.find().sort({_id: -1}).then((categorys) => {
        res.render('admin/content/content-add', {
            userinfo: req.userinfo,
            categorys: categorys
        });
    });
});

/**
 * 内容管理添加保存
 * @type {Router|router}
 */
router.post('/content/add', (req, res, next) => {
    if ( req.body.title === '') {
        res.render('admin/error', {
            userinfo: req.userinfo,
            errormessage: '标题不能为空'
        });
        return;
    }
    if ( req.body.content === '') {
        res.render('admin/error', {
            userinfo: req.userinfo,
            errormessage: '内容不能为空'
        });
        return ;
    }
    //保存到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userinfo._id.toString()
    }).save().then((rs) => {
        res.render('admin/success', {
            userinfo: req.userinfo,
            message: '保存成功',
            url: '/admin/content'
        });
    });
});

/**
 * 内容管理删除
 * @type {Router|router}
 */
router.get('/content/delete', (req, res, next) => {
    let id = req.query.id;
    Content.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userinfo: req.userinfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});

/**
 * 内容编辑
 * @type {Router|router}
 */
router.get('/content/edit', (req, res, next) => {
    let id = req.query.id,
        categorys = [];
    Category.find().sort({_id: -1}).then((cs) => {
        categorys = cs;
        return  Content.findOne({
            _id: id
        }).populate('category');
    }).then((content) => {
        res.render('admin/content/content-edit', {
            content: content,
            categorys: categorys,
            userinfo: req.userinfo
        });
    });
});

/**
 * 内容修改保存
 * @type {Router|router}
 */
router.post('/content/edit', (req, res, next) => {
   let id = req.body.id,
       title = req.body.title,
       description = req.body.description,
       contnet = req.body.content;

    if (title === '') {
       res.render('admin/error', {
           errormessage: '标题不能为空',
           userinfo: req.userinfo
       });
       return;
   }
    if (description === '') {
        res.render('admin/error', {
            errormessage: '简介不能为空',
            userinfo: req.userinfo
        });
        return;
    }
    if (contnet === '') {
        res.render('admin/error', {
            errormessage: '内容不能为空',
            userinfo: req.userinfo
        });
        return;
    }
    Content.updateOne({
        _id: id
    }, {
        category: req.body.category,
        title: title,
        content: contnet,
        description: description
    }).then(()=> {
        res.render('admin/success', {
            message: '修改成功',
            url: '/admin/content',
            userinfo: req.userinfo
        });
    });
});


module.exports = router;