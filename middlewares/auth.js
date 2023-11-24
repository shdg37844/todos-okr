const authMiddleware = {
    mustLogin: function (req, res, next) {
        if (!res.locals.isLogin) {
            res.redirect('/')
            return
        }

        next();
    },
}

module.exports = authMiddleware;