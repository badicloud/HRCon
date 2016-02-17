(function () {

    $(function() {
        $('#RegisterButton').click(function (e) {
            e.preventDefault();
            abp.ui.setBusy(
                $('#RegisterArea'),
                abp.ajax({
                    url: abp.appPath + 'Account/Register',
                    type: 'POST',
                    data: JSON.stringify({
                        tenancyName: $('#TenancyNameInput').val(),
                        email: $('#EmailInput').val(),
                        password: $('#PasswordInput').val(),
                        name: $('#NameInput').val(),
                        surname: $('#SurnameInput').val()
                    })
                })
            );
        });
    });

})();