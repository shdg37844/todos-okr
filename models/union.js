const Base = require('./base');
const knex = require('./knex'); 

class Union extends Base {
    constructor() {
        super('todos');
    }

    async todosWithSubtodos() {
        //// 这里的 todos 是一个数组，包含了从数据库中查询得到的所有待办事项
        const todos = await this.all();

        //对每个待办事项查询其子待办事项
        for (const todo of todos) {
            // 返回一个数组，包含所有与当前 todo 相关联的子待办事项
            const subTodos = await knex('subtodos').where('todosId', '=', todo.id);
            // 将查询到的子待办事项数组赋值给当前 todo 对象的 subTodos 属性
            todo.subTodos = subTodos;
        }

        return todos;
    }
}

module.exports = Union;