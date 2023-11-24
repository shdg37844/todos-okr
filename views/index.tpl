{% extends './layout.tpl' %}

{% block css %}
  <link rel="stylesheet" href="/stylesheets/login.css">
{% endblock %}

{% block content %}
  <div class="login-form">
    <h1 class="login-title">登录</h1>
    <div class="form-detail">
      <div class="form-input">
        <input type="text" name="phone" id="phone" class="inner-input" placeholder="请输入你的手机">
      </div>
      <div class="form-input">
        <input type="password" name="password" id="password" class="inner-input" placeholder="请输入你的密码">
      </div>
    </div>
    <div id="submit" class="login-btn">
      <span>确认登录</span>
    </div>  
  </div>
  
{% endblock %}

{% block js %}
<script src="https://lib.baomitu.com/jquery/3.3.1/jquery.min.js"></script>
<script src="/javascripts/login.js"></script>
{% endblock %}