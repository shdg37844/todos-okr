const PAGE = {
    init: function () {
        this.bind();
    },
    bind: function () {
        $('#submit').on('click', this.handleSubmit);
    },
    handleSubmit: function () {
        let password = $('#password').val();
        let phone = $('#phone').val();



        if (!password || !phone) {
            alert('params empty!')
            return
        }

        $.ajax({
            url: '/api',
            data: { phone, password },
            type: 'POST',
            success: function (data) {
                if (data.code === 200) {
                    alert('登录成功!'),
                        location.href = '/todos'
                } else {
                    console.log(data)
                    alert('手机号或密码不正确')
                }
            },
            error: function (err) {
                console.log(err)
            }
        })


    }
}

PAGE.init();