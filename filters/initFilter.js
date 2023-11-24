module.exports = function (req, res, next) {
    res.locals.seo = {
        title: 'todos-okr',
        keywords: 'todos-okr',
        description: 'todos-okr'
    }

    next();
}