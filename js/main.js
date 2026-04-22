// main.js

// Чекаємо, поки завантажиться весь HTML, і запускаємо головну функцію
document.addEventListener('DOMContentLoaded', init);

// Головна функція ініціалізації (як вимагає методичка)
function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initFooterYear();
    initAccordion();
    initFilters();
    initContactForm();
    initModal();
}

// ==========================================
// 1. Підсвічування активної сторінки в навігації
// ==========================================
function initActiveNav() {
    // Знаходимо всі посилання в нашому меню
    const links = document.querySelectorAll('.nav-list a');
    
    // Отримуємо поточну адресу сторінки (наприклад, "about.html")
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html'; // Якщо шлях порожній, вважаємо, що це головна

    links.forEach(link => {
        // Отримуємо куди веде посилання і беремо тільки назву файлу
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();

        // Спочатку забираємо клас active у всіх посилань (щоб уникнути дублювання)
        link.classList.remove('active');

        // Якщо назва файлу в посиланні збігається з поточною сторінкою — додаємо клас
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}
// ==========================================
// 3. Кнопка відкриття/закриття мобільного меню
// ==========================================
function initMenuToggle() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    // Перевіряємо, чи є ці елементи на сторінці
    if (toggleBtn && navList) {
        
        // 1. Відкриття/закриття по кліку на кнопку
        toggleBtn.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', isOpen); // Оновлюємо атрибут
        });

        // 2. Автоматичне закриття після кліку на посилання
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Закриваємо меню тільки якщо ми на мобільному екрані
                if (window.innerWidth <= 768) {
                    navList.classList.remove('is-open');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}
function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    const body = document.body;

    // Перевіряємо, чи була тема збережена раніше в localStorage
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme === 'dark') {
        body.classList.add('theme-dark');
    }

    // Слухаємо клік
    toggleBtn?.addEventListener('click', () => {
        body.classList.toggle('theme-dark');
        
        // Зберігаємо вибір у localStorage
        if (body.classList.contains('theme-dark')) {
            localStorage.setItem('siteTheme', 'dark');
        } else {
            localStorage.setItem('siteTheme', 'light');
        }
    });
}
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    
    // Показуємо кнопку тільки після прокрутки
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            btn.hidden = false;
        } else {
            btn.hidden = true;
        }
    });

    // Плавна прокрутка вгору
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
function initFooterYear() {
    const yearSpan = document.querySelector('#current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            // Перемикаємо атрибут hidden
            content.hidden = !content.hidden;
        });
    });
}
// ==========================================
// 7. Фільтрація карток (Меню)
// ==========================================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    // Якщо на сторінці немає кнопок фільтру (наприклад, ми не на Головній), то нічого не робимо
    if (filterBtns.length === 0 || menuItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Забираємо клас active у всіх кнопок і додаємо тій, на яку натиснули
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Дізнаємося, яку категорію обрав користувач (з атрибута data-filter)
            const filterValue = btn.getAttribute('data-filter');

            // 3. Проходимося по всіх стравах і ховаємо або показуємо їх
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block'; // Показуємо
                } else {
                    item.style.display = 'none';  // Ховаємо
                }
            });
        });
    });
}
// ==========================================
// 8. Форма: Валідація, лічильник та чернетка
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const statusMsg = document.getElementById('form-status');

    // Якщо на сторінці немає форми — виходимо
    if (!form || !messageInput || !charCount || !statusMsg) return;

    // 1. Відновлення чернетки
    const savedDraft = localStorage.getItem('contactDraft');
    if (savedDraft) {
        messageInput.value = savedDraft;
        charCount.textContent = savedDraft.length;
    }

    // 2. Лічильник символів та збереження чернетки
    messageInput.addEventListener('input', () => {
        const currentLength = messageInput.value.length;
        charCount.textContent = currentLength;
        localStorage.setItem('contactDraft', messageInput.value);
    });

    // 3. Обробка відправки форми
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Зупиняємо відправку на сервер

        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const msg = messageInput.value.trim();

        // Базова перевірка
        if (name === '' || email === '' || msg === '') {
            statusMsg.textContent = 'Помилка: Заповніть усі обов\'язкові поля!';
            statusMsg.style.backgroundColor = '#f8d7da';
            statusMsg.style.color = '#721c24';
            statusMsg.hidden = false;
            return;
        }

        // Якщо все добре
        statusMsg.textContent = `Дякуємо, ${name}! Ваше повідомлення відправлено.`;
        statusMsg.style.backgroundColor = '#d4edda';
        statusMsg.style.color = '#155724';
        statusMsg.hidden = false;

        // Збираємо дані в об'єкт
        const formData = { 
            name: name, 
            email: email, 
            message: msg 
        };
        console.log('Дані форми:', formData);

        // Очищаємо форму і видаляємо чернетку
        form.reset();
        localStorage.removeItem('contactDraft');
        charCount.textContent = '0';
    });
}
// ==========================================
// 9. Модальне вікно
// ==========================================
function initModal() {
    const openBtn = document.querySelector('.btn-open-modal');
    const modal = document.getElementById('promoModal');
    const closeBtn = document.querySelector('.modal-close');

    // Якщо ми не на Головній сторінці (кнопки немає), то нічого не робимо
    if (!openBtn || !modal) return;

    // 1. Відкриваємо вікно по кліку на кнопку
    openBtn.addEventListener('click', () => {
        modal.hidden = false;
    });

    // 2. Закриваємо вікно по кліку на хрестик
    closeBtn.addEventListener('click', () => {
        modal.hidden = true;
    });

    // 3. Закриваємо, якщо користувач клікнув на темний фон поза вікном
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });

    // 4. Закриваємо по клавіші "Escape" на клавіатурі
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) {
            modal.hidden = true;
        }
    });
}