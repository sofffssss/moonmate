document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. МОБІЛЬНЕ МЕНЮ
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. ЛОГІКА ПРОФІЛЮ
    // ==========================================
    const profileForm = document.getElementById('profileForm');
    const btnEdit = document.getElementById('btnEdit');

    if (profileForm && btnEdit) {
        btnEdit.addEventListener('click', () => {
            profileForm.classList.add('is-editing');
            document.getElementById('avatarWrapper').classList.add('editing');
        });
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const formData = new FormData(profileForm);
            document.getElementById('displayName').textContent = formData.get('name');
            document.getElementById('viewCity').textContent = formData.get('city');
            document.getElementById('viewAge').textContent = formData.get('age');
            document.getElementById('viewMoon').textContent = formData.get('moon');
            document.getElementById('displayLooking').textContent = formData.get('looking');
            document.getElementById('displayAbout').textContent = formData.get('about');
            profileForm.classList.remove('is-editing');
            document.getElementById('avatarWrapper').classList.remove('editing');
        });
        const avatarWrapper = document.getElementById('avatarWrapper');
        const avatarUpload = document.getElementById('avatarUpload');
        const avatarImage = document.getElementById('avatarImage');
        avatarWrapper.addEventListener('click', () => {
            if (avatarWrapper.classList.contains('editing')) avatarUpload.click();
        });
        avatarUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => { avatarImage.src = e.target.result; };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================
    // 3. ЛОГІКА СТОРІНКИ ПОШУКУ (ФІЛЬТРИ, ЛАЙКИ, ПАГІНАЦІЯ)
    // ==========================================
    const btnToggleFilters = document.getElementById('btnToggleFilters');
    const filtersPanel = document.getElementById('filtersPanel');
    const btnApplyFilters = document.getElementById('btnApplyFilters');
    const btnResetFilters = document.getElementById('btnResetFilters');
    const ageSlider = document.getElementById('ageSlider');
    const ageValue = document.getElementById('ageValue');
    const distSlider = document.getElementById('distSlider');
    const distValue = document.getElementById('distValue');
    const moonBtns = document.querySelectorAll('.moon-btn');
    const allCards = Array.from(document.querySelectorAll('.profile-mini-card')); // Масив усіх карток
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const likeIcons = document.querySelectorAll('.like-icon');

    // Змінні для пагінації та фільтрації
    let currentPage = 1;
    const cardsPerPage = 8;
    let filteredCards = [...allCards]; // Спочатку всі картки доступні
    let selectedMoon = 'Повня'; // За замовчуванням

    // --- 3.1 Відкриття панелі фільтрів ---
    if (btnToggleFilters && filtersPanel) {
        btnToggleFilters.addEventListener('click', () => {
            filtersPanel.classList.toggle('hidden');
            if (!filtersPanel.classList.contains('hidden')) {
                filtersPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // --- 3.2 Оновлення текстів слайдерів ---
    if (ageSlider && ageValue) {
        ageSlider.addEventListener('input', function() {
            ageValue.textContent = `Вік: 18 - ${this.value}`;
        });
    }
    if (distSlider && distValue) {
        distSlider.addEventListener('input', function() {
            distValue.textContent = this.value + ' км';
        });
    }

    // --- 3.3 Вибір фази місяця ---
    moonBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            moonBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedMoon = this.getAttribute('data-moon');
        });
    });

    // --- 3.4 ФУНКЦІЯ ВІДОБРАЖЕННЯ СТОРІНКИ (Рендер) ---
    function renderPage() {
        // 1. Ховаємо ВСІ картки
        allCards.forEach(card => card.style.display = 'none');

        // 2. Вираховуємо, які картки показувати на поточній сторінці
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const cardsToShow = filteredCards.slice(startIndex, endIndex);

        // 3. Показуємо тільки потрібні
        cardsToShow.forEach(card => {
            card.style.display = 'flex'; 
        });

        // 4. Оновлюємо стан кнопок пагінації (блокуємо, якщо це крайня сторінка)
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        
        if (btnPrevPage) {
            btnPrevPage.disabled = currentPage === 1;
            btnPrevPage.style.opacity = currentPage === 1 ? '0.5' : '1';
            btnPrevPage.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
        }
        
        if (btnNextPage) {
            btnNextPage.disabled = currentPage >= totalPages || totalPages === 0;
            btnNextPage.style.opacity = (currentPage >= totalPages || totalPages === 0) ? '0.5' : '1';
            btnNextPage.style.cursor = (currentPage >= totalPages || totalPages === 0) ? 'not-allowed' : 'pointer';
        }
    }
        // --- 3.5 ЗАСТОСУВАННЯ ФІЛЬТРІВ ---
        if (btnApplyFilters) {
            btnApplyFilters.addEventListener('click', function(e) {
                e.preventDefault(); 
                
                // Отримуємо максимальний вік (якщо слайдера немає, ставимо 99)
                const maxAge = ageSlider ? parseInt(ageSlider.value) : 99;
                
                // Отримуємо вибрану фазу місяця (якщо нічого не вибрано, беремо "Повня")
                // selectedMoon вже оновлюється при кліку на кнопки moon-btn у вашому коді
    
                // Фільтруємо масив карток
                filteredCards = allCards.filter(card => {
                    const cardAge = parseInt(card.getAttribute('data-age'));
                    const cardMoon = card.getAttribute('data-moon');
    
                    // Перевірка віку (вік картки має бути меншим або дорівнювати максимальному)
                    const ageMatch = !isNaN(cardAge) && cardAge <= maxAge;
                    
                    // Перевірка фази місяця (точний збіг)
                    const moonMatch = (cardMoon === selectedMoon);
    
                    // Картка проходить, якщо ОБИДВІ умови виконані
                    return ageMatch && moonMatch;
                });
    
                // Виводимо в консоль для перевірки (F12 -> Console)
                console.log(`Знайдено анкет: ${filteredCards.length}. Фільтр: вік до ${maxAge}, місяць: ${selectedMoon}`);
    
                // Скидаємо на першу сторінку після фільтрації
                currentPage = 1; 
                
                // Перемальовуємо сітку (викликаємо функцію, яку ми виправили раніше)
                renderPage();
                
                // Закриваємо панель фільтрів
                if (filtersPanel) {
                    filtersPanel.classList.add('hidden'); 
                }
    
                // Прокручуємо до карток, щоб користувач побачив результат
                const cardsSection = document.querySelector('.cards-section');
                if (cardsSection) {
                    cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    // --- 3.6 СКИДАННЯ ФІЛЬТРІВ ---
    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', function(e) {
            e.preventDefault();

            // 1. Скидаємо повзунок віку на максимум (99)
            if (ageSlider && ageValue) {
                ageSlider.value = 99;
                ageValue.textContent = 'Вік: 18 - 99';
            }

            // 2. Скидаємо повзунок відстані
            if (distSlider && distValue) {
                distSlider.value = 57; // Початкове значення
                distValue.textContent = '57 км';
            }

            // 3. Скидаємо фазу місяця на "Повня"
            selectedMoon = 'Повня';
            
            // Оновлюємо класи active у кнопок місяця
            moonBtns.forEach(btn => {
                if (btn.getAttribute('data-moon') === 'Повня') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // 4. Повертаємо ВСІ картки в масив для відображення
            filteredCards = [...allCards]; 
            
            // 5. Скидаємо на першу сторінку
            currentPage = 1; 
            
            // 6. Перемальовуємо сітку
            renderPage(); 

            // 7. Закриваємо панель
            if (filtersPanel) {
                filtersPanel.classList.add('hidden');
            }

            // 8. Плавно прокручуємо до карток, щоб побачити результат
            const cardsSection = document.querySelector('.cards-section');
            if (cardsSection) {
                cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            console.log("Фільтри скинуто. Показано всі картки.");
        });
    }
    // --- 3.7 ПАГІНАЦІЯ (Виправлено) ---
    if (btnNextPage && btnPrevPage) {
        btnNextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
            
            // Перевіряємо, чи є ще сторінки
            if (currentPage < totalPages && totalPages > 0) {
                currentPage++;
                renderPage();
                
                // Прокрутка вгору до карток для зручності
                document.querySelector('.cards-section').scrollIntoView({ behavior: 'smooth' });
            }
        });

        btnPrevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage();
                
                // Прокрутка вгору до карток
                document.querySelector('.cards-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
   }
})

    // --- 3.8 ЛАЙКИ ---
    const emptyHeart = '../main/img/image 74.png'; 
    const filledHeart = '../main/img/Group 153.png'; 
    // Знаходимо всі сердечка на сторінці
    const likeIcons = document.querySelectorAll('.like-icon');

    likeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Перевіряємо, чи вже стоїть лайк
            if (this.classList.contains('liked')) {
                // Якщо так — прибираємо лайк
                this.src = emptyHeart;
                this.classList.remove('liked');
            } else {
                // Якщо ні — ставимо лайк (міняємо картинку)
                this.src = filledHeart;
                this.classList.add('liked');
            }
        });
    });