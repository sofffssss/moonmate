// Функція для відображення прев'ю картинки
function previewImage(event, inputElement) {
    const file = event.target.files[0];
    
    if (file) {
        // Перевіряємо, чи це дійсно картинка
        if (!file.type.startsWith('image/')) {
            alert('Будь ласка, виберіть файл зображення (jpg, png, тощо).');
            return;
        }

        const reader = new FileReader();
        
        // Знаходимо батьківський контейнер (наш рожевий квадрат)
        const box = inputElement.closest('.upload-box');
        // Знаходимо тег img всередині цього квадрата
        const img = box.querySelector('.preview-img');
        
        reader.onload = function(e) {
            img.src = e.target.result; // Встановлюємо шлях до картинки
            box.classList.add('has-image'); // Додаємо клас, щоб показати картинку
        }
        
        reader.readAsDataURL(file);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Зупиняємо відправку форми
            
            // Імітація успішної реєстрації
            alert('Реєстрація успішна! Ласкаво просимо до зграї!');
            
            // Перекидаємо на сторінку профілю
            window.location.href = '../profile/profile.html'; 
        });
    }
});