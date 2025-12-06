const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');
const loginForm = document.querySelector('#loginForm');
const inputs = loginForm.querySelectorAll('input');

togglePassword.addEventListener('click', function (e) {
    this.classList.add('animate-click');
    setTimeout(() => {
        this.classList.remove('animate-click');
    }, 400);

    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');

    if (type === 'text') {
        this.setAttribute('title', 'Ẩn mật khẩu');
    } else {
        this.setAttribute('title', 'Hiện mật khẩu');
    }
});

function showError(input, message) {
    const group = input.closest('.input-group');
    const errorSpan = group.querySelector('.error-message');

    if (message) {
        errorSpan.textContent = message;
    }

    group.classList.add('error');

    group.style.animation = 'none';
    group.offsetHeight; /* trigger reflow */
    group.style.animation = null;
}

function clearError(input) {
    const group = input.closest('.input-group');
    if (group.classList.contains('error')) {
        group.classList.remove('error');
    }
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    let usernameVal = document.getElementById('username').value.trim();
    let passVal = passwordInput.value;

    if (!usernameVal) {
        showError(document.getElementById('username'), 'Vui lòng nhập tài khoản');
        isValid = false;
    }
    if (!passVal) {
        showError(passwordInput, 'Vui lòng nhập mật khẩu');
        isValid = false;
    }

    if (isValid) {
        if (usernameVal === 'admin' && passVal === 'demo123') {
            window.location.href = 'pages/mainDashBoard.html';
        } else {
            showError(passwordInput, 'Sai mật khẩu hoặc tài khoản');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
});

inputs.forEach(input => {
    input.addEventListener('input', function () {
        clearError(this);
    });
});
