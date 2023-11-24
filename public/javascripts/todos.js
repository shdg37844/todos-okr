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
        $('#todos-filter').on('click', '.filter-item', this.handleFilterClick.bind(this)); //this的用法
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
        let todosHtml = this.data.todos.filter(todo => {

            switch (this.data.filter) {
                case 2: // todo全部都没有选过
                    return todo.completed === 0;
                case 3: // todo某个被选过
                    return todo.completed === 1;
                case 4: // 全部都完成
                    return todo.subTodos.every(subTodo => subTodo.completed === 1);
                default: // 默认显示所有待办事项
                    return true;
            }


        }).map(todo => {
            let subTodosHtml = todo.subTodos.map(subTodo => {
                return `
                    <div class="sub-todo-item" data-id="${subTodo.id}" data-completed="${subTodo.completed}">
                        <div class="sub-toggle sub-item-hd"></div>
                        <div class="sub-item-bd">${subTodo.subcontent}</div>
                        <div class="delete-subtodos sub-item-ft">x</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="todo-item">
                    <div class="todo-item-content" data-id="${todo.id}">
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
    addsubtodos: function () {
        //let todosId = $(this).closest('.todo-item-content').data('id');
        let todosId = $(this).closest('.todo-item').find('.todo-item-content').data('id');
        let subcontent = $(this).closest('.subtodos-top-container').find('.subs-input').val();

        if (!subcontent) {
            alert('内容不能为空')
            return
        }

        $.ajax({
            url: '/api/subtodos/' + todosId,
            data: { todosId, subcontent },
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
    deletetodos: function () {
        let todosId = $(this).closest('.todo-item').find('.todo-item-content').data('id');

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
        let subtodosId = $(this).closest('.sub-todo-item').data('id');
        let completed = subTodoItem.data('completed') === 1 ? 0 : 1;  //切换状态

        $.ajax({
            url: '/api/subtodos/' + subtodosId,
            data: { subtodosId, completed },
            type: 'PUT',
            success: function (data) {
                if (data.code === 200) {
                    subTodoItem.data('completed', completed); // 更新 data-completed 属性
                    if (completed === 1) {
                        subTodoItem.addClass('active');
                    } else {
                        subTodoItem.removeClass('active');
                    }
                } else {
                    console.error(data);
                }
            },
            error: function (err) {
                console.log(err)
            }
        })

    },

}

PAGE.init();