const todosModel = require('./../models/todos')
const Todo = new todosModel();

const UnionModel = require('./../models/union')
const Union = new UnionModel();

const todoController = {
    show: async function (req, res, next) {
        try {
            const todos = await Union.todosWithSubtodos();

            // 判断请求的类型，如果是 AJAX 请求，则返回 JSON 数据
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                res.json({ code: 200, data: todos });
            } else {
                // 否则渲染页面
                res.locals.todos = todos;
                res.render('todos.tpl', res.locals);
            }
        } catch (e) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                res.json({ code: 0, data: e })
            } else {
                res.locals.error = e;
                res.render('error', res.locals);
            }
        }
    },
    insert: async function (req, res, next) {
        let content = req.body.content;

        if (!content) {
            res.json({ code: 0, data: 'params empty!' });
            return
        }

        try {
            const union = await Union.insert({ content });
            res.json({ code: 200, data: union })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    },
    delete: async function (req, res, next) {
        let todosId = req.params.todosId;

        try {
            const todos = await Todo.delete(todosId);
            res.json({ code: 200, data: todos })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    },
    update: async function (req, res, next) {
        let todosId = req.params.todosId;
        let completed = Number(req.body.completed); // 转换为数字

        //console.log(todosId,completed)

        try {
            const todos = await Todo.update(todosId, { completed });
            res.json({ code: 200, data: todos })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    }
}

module.exports = todoController;