const subTodosModel = require('./../models/subtodos')
const subTodo = new subTodosModel();

const subTodoController = {
    show: async function (req, res, next) {
        try {
            const subTodos = await subTodo.all();
            res.locals.subTodos = subTodos;
            res.render('todos.tpl', res.locals)
        } catch (e) {
            res.locals.error = e;
            res.render('error', res.locals)
        }
    },
    insert: async function (req, res, next) {
        let subcontent = req.body.subcontent;
        let todosId = req.params.todosId


        if (!subcontent) {
            res.json({ code: 0, data: 'params empty!' });
            return
        }

        try {
            const subTodos = await subTodo.insert({ subcontent, todosId });
            res.json({ code: 200, data: subTodos })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    },
    delete: async function (req, res, next) {
        let subtodosId = req.params.subtodosId;

        try {
            const subTodos = await subTodo.delete(subtodosId);
            res.json({ code: 200, data: subTodos })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    },
    update: async function (req, res, next) {
        let subtodosId = req.params.subtodosId;
        let completed = Number(req.body.completed); // 转换为数字

        try {
            const subTodos = await subTodo.update(subtodosId, { completed });
            res.json({ code: 200, data: subTodos })
        } catch (e) {
            res.json({ code: 0, data: e })
        }
    }

}

module.exports = subTodoController;