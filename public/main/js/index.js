/**
 * @Author: Tuber
 * @Date: 2018/10/12
 * @Version: 1.0
 * @Last Modified by: Tuber
 * @Last Modified time: 2018/10/12
 */

$(function () {
    if (!$.cookie('userinfo_1')) {
        $('#registerBox').show();
    } else {
        var userinfo = JSON.parse($.cookie('userinfo_1'));
        $('#loginBox').hide();
        $('#registerBox').hide();
        $('#userBox').show();
        $('#name').html(userinfo.username);
        if (userinfo.type === 0) {
            $('#control').show();
        }
    }
    //进入页面，获取分类列表
    $.ajax({
        url: '/api/category',
        success: function (res) {
            if (res.code === 0) {
                let link = '<a href="/" class="focus">首页</a>';
                for (var i = 0; i < res.data.length; i++) {
                    link += '<a href="/'+res.data[i]._id+'" >'+res.data[i].name+'</a>';
                }
                $('#menu').html(link);
            }
        }
    });
    $('#go_login').on('click', function (e) {
       e.preventDefault();
       $('#loginBox').show();
       $('#registerBox').hide();
   });

    $('#go_register').on('click', function (e) {
        e.preventDefault();
        $('#loginBox').hide();
        $('#registerBox').show();
    });


    /**
     * 注册
     */

    $('#register').on('click', function () {
       var username = $('#registerBox').find('input[name=username]').val(),
           password = $('#registerBox').find('input[name=password]').val(),
           makesur = $('#registerBox').find('input[name=makesure]').val();
       if (username === '') {
           alert('用户名不能为空');
           return false;
       }
       if ( password === '') {
           alert('密码不能为空');
           return false;
       }
       if ( password !== makesur) {
           alert('确认密码不一致');
           return false;
       }
       $.ajax({
           url: '/api/user/register',
           type: 'post',
           data: {
               username: username,
               password: password
           },
           success: function (res) {
              if ( res.code === 0 ) {
                  alert('注册成功');
                  $('#loginBox').show();
                  $('#registerBox').hide();
              } else {
                  alert(res.message);
              }
           }
       });
    });

    /**
     * 登陆
     */
    $('#login').on('click', function () {
        var username = $('#loginBox').find('input[name=username]').val(),
            password = $('#loginBox').find('input[name=password]').val();
        if (username === '') {
            alert('用户名不能为空');
            return false;
        }
        if (password === '') {
            alert('密码不能为空');
            return false;
        }
        $.ajax({
            url: '/api/user/login',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (res) {
                if (res.code === 0) {
                    $("#loginBox").hide();
                    $('#userBox').show();
                    $('#name').html(res.userInfo.username);
                    if (res.userInfo.type === 0) {
                        $('#control').show();
                    }
                    $.cookie('userinfo_1', JSON.stringify(res.userInfo));
                } else {
                    alert(res.message);
                }
            }
        })
    });

    /**
     * 退出
     */
    $('#logoutBtn').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/user/logout',
            success: function () {
                $.removeCookie('userinfo_1');
                window.location.reload();
            }
        });
    });


});