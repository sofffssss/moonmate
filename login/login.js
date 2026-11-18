document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const CORRECT_USERNAME = "admin";
    const CORRECT_PASSWORD = "123456";

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value;

            if (!enteredUsername || !enteredPassword) {
                alert("Будь ласка, заповніть всі поля!");
                return;
            }

            if (enteredUsername === CORRECT_USERNAME && enteredPassword === CORRECT_PASSWORD) {
                // ЗМІНЕНО: Використовуємо sessionStorage замість localStorage
                sessionStorage.setItem('isLoggedIn', 'true');
                
                window.location.href = "../profile/profile.html";
            } else {
                alert("Неправильне ім'я користувача або пароль!");
                passwordInput.value = "";
                passwordInput.focus();
            }
        });
    }
});