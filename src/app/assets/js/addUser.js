const addUserBtn = document.getElementById('addUserBtn');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const admin = document.getElementById('admin');


addUserBtn.addEventListener('click', function (event) {

    console.log("hit")

    const data = {
        username: username.value,
        email: email.value,
        password: password.value,
        admin: admin.checked
    };

    $.ajax({
        url: '/dashboard/users/add',
        type: 'POST',
        data: data,
        success: function (result) {
            window.location.reload();
        },

        error: function (err) {
            console.log(err);
        }
    });
});