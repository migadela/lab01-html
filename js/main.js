// main.js

// Чекаємо, поки завантажиться весь HTML, і запускаємо головну функцію
document.addEventListener('DOMContentLoaded', init);

// Головна функція ініціалізації (як вимагає методичка)
async function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initFooterYear();
    initAccordion();
    //initFilters();
    initContactForm();
    initModal();
    initFavorites();
    await initCatalogPage();

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
// ==========================================
// ПРАКТИЧНА 9-10: Робота з даними (Каталог)
// ==========================================

async function initCatalogPage() {
    const catalogContainer = document.querySelector('[data-catalog]');
    const statusMsg = document.getElementById('catalog-status');

    // Якщо ми не на сторінці з каталогом — зупиняємось
    if (!catalogContainer || !statusMsg) return;

    try {
        // 1. Стан ЗАВАНТАЖЕННЯ (Loading state)
        statusMsg.textContent = 'Завантаження смачненького... ⏳';
        statusMsg.style.color = '#5c4033';
        catalogContainer.innerHTML = ''; // Очищаємо контейнер

        // 2. Отримуємо дані (Fetch)
        const response = await fetch('data/items.json'); 
        
        // Перевіряємо, чи успішна відповідь
        if (!response.ok) {
            throw new Error('Не вдалося знайти файл з даними');
        }

        const items = await response.json(); // Перетворюємо відповідь у масив об'єктів

        // 3. Стан УСПІХУ
        statusMsg.textContent = ''; // Прибираємо напис про завантаження
        
        // Малюємо картки
        renderCatalog(items, catalogContainer);

        // ВМИКАЄМО ПОШУК ТА ФІЛЬТРИ:
        initCatalogControls(items);
        initDetailsModal(items);

    } catch (error) {
        // 4. Стан ПОМИЛКИ (Error state)
        console.error(error);
        statusMsg.textContent = 'Ой! Не вдалося завантажити меню. Спробуйте оновити сторінку. 😢';
        statusMsg.style.color = 'red';
    }
}

// Функція для малювання карток (Динамічний рендеринг)
function renderCatalog(items, container) {
    if (items.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">На жаль, за вашим запитом нічого не знайдено.</p>';
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('aroma_favorites') || '[]');

    const htmlString = items.map(item => {
        const isFav = favorites.includes(item.id); 
        const btnText = isFav ? '❤️ В обраному' : '🤍 В обране';
        const btnStyle = isFav ? 'background: #d35400; color: white;' : 'background: transparent; color: #d35400;';

        return `
        <div class="menu-item card" data-category="${item.category}" style="display: flex; flex-direction: column; padding: 15px;">
            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
            <strong style="font-size: 1.2rem; color: #d35400;">${item.title} — ${item.price} грн</strong>
            <p style="flex-grow: 1;">${item.description}</p>
            
            <button class="btn-favorite" data-id="${item.id}" style="margin-top: 10px; padding: 8px; border: 1px solid #d35400; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s; ${btnStyle}">
                ${btnText}
            </button>

            <button class="btn-details" data-id="${item.id}" style="margin-top: 10px; padding: 8px; background: #5c4033; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                🔍 Детальніше
            </button>
        </div>
        `;
    }).join('');

    container.innerHTML = htmlString;
}
// Функція для керування пошуком, фільтрами та сортуванням
function initCatalogControls(items) {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogContainer = document.querySelector('[data-catalog]');
    const loadMoreBtn = document.getElementById('loadMoreBtn'); // <-- НОВЕ

    let currentSearch = '';
    let currentCategory = 'all';
    let currentSort = 'default';
    let visibleCount = 4; // показуємо спочатку 4

    function applyFiltersAndRender() {
        let filteredItems = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                  item.description.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            return matchesSearch && matchesCategory;
        });

        if (currentSort === 'price-asc') {
            filteredItems.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-desc') {
            filteredItems.sort((a, b) => b.price - a.price);
        }

        // показуємо тільки частину (slice)
        const itemsToShow = filteredItems.slice(0, visibleCount);
        renderCatalog(itemsToShow, catalogContainer);

        //  ховаємо або показуємо кнопку
        if (loadMoreBtn) {
            loadMoreBtn.style.display = (visibleCount < filteredItems.length) ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            visibleCount = 4; //  скидаємо при пошуку
            applyFiltersAndRender();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            visibleCount = 4; //  скидаємо при фільтрації
            applyFiltersAndRender();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFiltersAndRender();
        });
    }

    // "Показати ще"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 4; 
            applyFiltersAndRender();
        });
    }

    applyFiltersAndRender(); // Початковий рендер
}
// ==========================================
// 8. Логіка Обраного (Favorites)
// ==========================================
function initFavorites() {
    const catalogContainer = document.querySelector('[data-catalog]');
    if (!catalogContainer) return;

    // Слухаємо кліки по всьому каталогу
    catalogContainer.addEventListener('click', (event) => {
        // Шукаємо, чи клікнули саме по кнопці "В обране"
        const btn = event.target.closest('.btn-favorite');
        if (!btn) return;

        // Беремо ID товару з атрибута data-id
        const itemId = btn.getAttribute('data-id');
        
        // Дістаємо поточний масив обраного з пам'яті
        let favorites = JSON.parse(localStorage.getItem('aroma_favorites') || '[]');

        // Перевіряємо, чи є вже цей товар у списку
        if (favorites.includes(itemId)) {
            // Якщо Є — видаляємо його (залишаємо всі, крім цього ID)
            favorites = favorites.filter(id => id !== itemId);
            btn.innerHTML = '🤍 В обране';
            btn.style.background = 'transparent';
            btn.style.color = '#d35400';
        } else {
            // Якщо НЕМАЄ — додаємо його
            favorites.push(itemId);
            btn.innerHTML = '❤️ В обраному';
            btn.style.background = '#d35400';
            btn.style.color = 'white';
        }

        // Зберігаємо оновлений список назад у пам'ять браузера
        localStorage.setItem('aroma_favorites', JSON.stringify(favorites));
    });
}
function initDetailsModal(items) {
    const catalogContainer = document.querySelector('[data-catalog]');
    const modal = document.getElementById('itemModal');
    const closeBtn = document.getElementById('closeItemModal');

    catalogContainer.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-details');
        if (!btn) return;

        const itemId = btn.getAttribute('data-id');
        const item = items.find(i => i.id === itemId);

        if (item) {
            document.getElementById('modalImage').src = item.image;
            document.getElementById('modalTitle').textContent = item.title;
            document.getElementById('modalPrice').textContent = `${item.price} грн`;
            document.getElementById('modalDesc').textContent = item.fullDescription;
            modal.hidden = false;
        }
    });

    closeBtn.addEventListener('click', () => modal.hidden = true);
}
