{% extends './layout.tpl' %}

{% block css %}
  <link rel="stylesheet" href="/stylesheets/todos.css">
{% endblock %}

{% block content %}
<div class="todos-container">
        <h1 class="todos-title">todos</h1>
        <div class="todos-content">
            <div class="todos-top-container">
                <div class="todos-input-cell">
                    <input id="todo-input" class="todos-input" type="text" name="todo" placeholder="请输入计划事项">
                </div>
                <div id="todo-submit" class="todos-add-btn">添加</div>
            </div>

            <div id="todos-list" class="todos-list">
                
            </div>

            <div class="todos-filter" id="todos-filter">
                <span class="filter-item active" data-filter="1">全部todo</span>
                <span class="filter-item" data-filter="2">todo全部都没有选过</span>
                <span class="filter-item" data-filter="3">todo某个被选过</span>
                <span class="filter-item" data-filter="4">todo所有被选上</span>
            </div>
        </div>
    </div>
{% endblock %}

{% block js %}
<script src="https://lib.baomitu.com/jquery/3.3.1/jquery.min.js"></script>
<script src="/javascripts/todos.js"></script>
{% endblock %}