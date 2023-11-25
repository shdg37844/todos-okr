const PAGE = {
    init: function () {
        this.data = {
            todos: [],
            filter: 1,
            filters: {
                1: '默认所有的todo',
                2: 'todo全部都没有选过',
                3: 'todo某个被选过',
                4: 'todo全部都完成',
            }
        };
        this.bind();
        this.getTodos();
    },
    bind: function () {
        $('#todo-submit').on('click', this.addtodos.bind(this));
        $('#todos-list').on('click', '.delete-submit', this.deletetodos);
        $('#todos-list').on('click', '.subtodos-add-btn', this.addsubtodos);
        $('#todos-list').on('click', '.delete-subtodos', this.deletesubtodos);
        $('#todos-list').on('click', '.sub-toggle', this.togglesubtodos);
        $('#todos-filter').on('click', '.filter-item', this.handleFilterClick.bind(this));
    },

    getTodos: function () {
        $.ajax({
            url: '/todos',
            type: 'GET',
            dataType: 'json',
            success: (response) => {
                this.data.todos = response.data;
                this.renderTodos();
            },
            error: function (err) {
                console.log(err);
            }
        });
    },

    renderTodos: function () {
        let todos = this.data.todos;
        let filter = this.data.filter;
        let todosHtml = todos.filter(todo => {

            //这里todo是一个对象，subTodos是数组，数组方法只能在数组里用才有效
            switch (filter) {
                case 2: // 所有未完成的待办事项
                    return todo.subTodos.every(subTodo => subTodo.completed === 0);
                case 3: // 至少一个子任务完成
                    return todo.subTodos.some(subTodo => subTodo.completed === 1);
                case 4: // 所有都已完成
                    return todo.subTodos.every(subTodo => subTodo.completed === 1);
                default: // 默认显示所有todo
                    return true; // 保留所有的 todo
            }

        }).map(todo => {
            let subTodosHtml = todo.subTodos.map(subTodo => {
                let subItemClass = subTodo.completed === 1 ? 'active' : ''; 
                return `
                    <div class="sub-todo-item ${subItemClass}" data-id="${subTodo.id}" data-completed="${subTodo.completed}">
                        <div class="sub-toggle sub-item-hd"></div>
                        <div class="sub-item-bd">${subTodo.subcontent}</div>
                        <div class="delete-subtodos sub-item-ft">x</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="todo-item" data-id="${todo.id}">
                    <div class="todo-item-content">
                        <div class="todo-item-hd"></div>
                        <div class="todo-item-bd">${todo.content}</div>
                        <div class="delete-submit todo-item-ft">x</div>
                    </div>
                    <div class="subtodos-top-container">
                        <div class="sub-input-cell">
                            <input class="subs-input" type="text" name="todo" placeholder="请输入子计划事项">
                        </div>
                        <div class="subtodos-add-btn">添加</div>
                    </div>
                    ${subTodosHtml}
                </div>
            `;
        }).join('');

        $('#todos-list').html(todosHtml);
    },

    handleFilterClick: function (e) {
        let filterValue = parseInt($(e.target).data('filter'), 10);
        if (!isNaN(filterValue)) {
            this.data.filter = filterValue;
            $('.filter-item').removeClass('active');
            $(e.target).addClass('active'); // 为选中的过滤器添加活动状态
            this.renderTodos(); // 根据新的过滤条件重新渲染待办事项
        } else {
            console.error('错误');
        }
    },
    addtodos: function () {
        let content = $('#todo-input').val();

        if (!content) {
            alert('内容不能为空')
            return
        }

        $.ajax({
            url: '/api/todos',
            data: { content },
            type: 'POST',
            success: function (data) {
                if (data.code === 200) {
                    alert('添加成功！')
                    location.reload()
                } else {
                    console.log(data)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    },
    addsubtodos: function (e) {
        let todosId = $(this).closest('.todo-item').data('id');
        let subcontent = $(this).closest('.subtodos-top-container').find('.subs-input').val();

        if (!subcontent) {
            alert('内容不能为空')
            return
        }

        $.ajax({
            url: '/api/subtodos/' + todosId,
            data: { todosId, subcontent },
            type: 'POST',
            success: (data) => {
                if (data.code === 200) {
                    alert('添加成功！')
                    location.reload()
                } else {
                    console.log(data)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    },
    deletetodos: function () {
        let todosId = $(this).closest('.todo-item').data('id');

        $.ajax({
            url: '/api/todos/' + todosId,
            data: { todosId },
            type: 'DELETE',
            success: function (data) {
                if (data.code === 200) {
                    alert('删除成功！')
                    location.reload()
                } else {
                    console.log(data)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })

    },
    deletesubtodos: function () {
        let subtodosId = $(this).closest('.sub-todo-item').data('id');

        $.ajax({
            url: '/api/subtodos/' + subtodosId,
            data: { subtodosId },
            type: 'DELETE',
            success: function (data) {
                if (data.code === 200) {
                    alert('删除成功！')
                    location.reload()
                } else {
                    console.log(data)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })

    },
    togglesubtodos: function () {
        let subTodoItem = $(this).closest('.sub-todo-item');
        let subtodosId = subTodoItem.data('id');
        let todoItem = subTodoItem.closest('.todo-item');
        let todosId = todoItem.data('id');
        let completed = subTodoItem.data('completed');
        completed = (completed === 1 || completed === null) ? 0 : 1;

        $.ajax({
            url: '/api/subtodos/' + subtodosId,
            data: { completed: completed },
            type: 'PUT',
            success: (data) => {
                if (data.code === 200) {
                    subTodoItem.data('completed', completed);   //更新data-complete的值
                    subTodoItem.toggleClass('active', completed === 1);

                    // 检查是否所有子待办事项都完成了
                    let allCompleted = todoItem.find('.sub-todo-item').toArray().every(item => $(item).data('completed') === 1);
                    // 更新主项目的完成状态
                    let mainCompleted = allCompleted ? 1 : 0;
                    todoItem.data('completed', mainCompleted);
                    todoItem.toggleClass('active', allCompleted);

                    //向后端发送关于主项目completed情况变更的请求
                    $.ajax({
                        url: '/api/todos/' + todosId,
                        data: { completed: mainCompleted },
                        type: 'PUT',
                        success: function (data) {

                        },
                        error: function (err) {
                            console.error('Failed to update main todo status:', err);
                        }
                    });
                } else {
                    console.error(data);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    },


}

PAGE.init();