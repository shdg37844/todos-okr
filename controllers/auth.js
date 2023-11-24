const UserModel = require('./../models/users.js');
const User = new UserModel();
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
    login: async function (req, res, next) {
        let phone = req.body.phone;
        let password = req.body.password;

        if (!phone || !password) {
            res.json({ code: 0, data: ' params empty! ' });
        }

        try {
            const users = await User.select({ phone, password });
            const user = users[0];

            if (user) {
                //将信息放到JWT中加密
                let token = JWT.sign({
                    user_id: user.id,
                    phone: user.phone,
                }, JWT_SECRET, {
                    expiresIn: "30d"
                });
                //在响应中设置一个名为web_token的cookie，其值为之前创建的JWT token，并设置其最大存活时间为30天
                res.cookie('web_token', token, { maxAge: 30 * 24 * 60 * 60 });
                res.json({ code: 200, message: '登录成功！', data: { token: token } });
            } else {
                res.json({ code: 0, data: { msg: '登录失败，没有此用户！' } })
            }
        } catch (e) {
            console.error(e); // 输出错误信息到控制台
            res.json({ code: 0, data: e.toString() }); // 发送错误信息的字符串表示给客户端
        }
    },
    logout: async function (req, res, next) {
        res.clearCookie('web_token');
        res.redirect('/')
    },
    renderLogin: async function (req, res, next) {
        if (res.locals.isLogin) {
            res.redirect('/todos')
            return
        }
        res.render('index.tpl', res.locals)
    },
}

module.exports = authController;