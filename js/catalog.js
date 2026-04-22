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
async function initCatalogPage() {
    const catalogContainer = document.querySelector('[data-catalog]');
    const statusMsg = document.getElementById('catalog-status');

    if (!catalogContainer || !statusMsg) return;

    try {
        statusMsg.textContent = 'Завантаження смачненького з сервера... ⏳';
        statusMsg.style.color = '#5c4033';
        catalogContainer.innerHTML = ''; 

        const items = await getItems(); 
        
        if (items.length === 0) {
            statusMsg.textContent = 'Меню поки порожнє. Додайте нові товари!';
        } else {
            statusMsg.textContent = ''; 
        }
        
        renderCatalog(items, catalogContainer);

        initCatalogControls(items);
        initDetailsModal(items);

        // ОБРОБНИК КЛІКІВ (Видалення + Редагування)
        catalogContainer.addEventListener('click', async (event) => {
            
            // 1. ЛОГІКА ВИДАЛЕННЯ
            const deleteBtn = event.target.closest('.btn-delete');
            if (deleteBtn) {
                const itemId = deleteBtn.getAttribute('data-id');
                if (confirm('Ви точно хочете видалити цей товар?')) {
                    try {
                        await deleteItem(itemId);
                        await initCatalogPage();
                    } catch (error) {
                        alert('Помилка при видаленні.');
                    }
                }
                return;
            }

            // 2. ЛОГІКА РЕДАГУВАННЯ
            const editBtn = event.target.closest('.btn-edit');
            if (editBtn) {
                const itemId = editBtn.getAttribute('data-id');
                try {
                    const item = items.find(i => i.id == itemId); 
                    const form = document.getElementById('add-item-form');
                    
                    document.getElementById('item-title').value = item.title;
                    document.getElementById('item-price').value = item.price;
                    document.getElementById('item-category').value = item.category;
                    document.getElementById('item-image').value = item.image;
                    document.getElementById('item-desc').value = item.description;

                    const submitBtn = form.querySelector('button[type="submit"]');
                    submitBtn.textContent = '💾 Зберегти зміни';
                    submitBtn.style.background = '#f39c12';
                    form.setAttribute('data-edit-id', itemId);
                    form.scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    console.error('Помилка редагування:', error);
                }
            }
        });

    } catch (error) {
        console.error(error);
        statusMsg.textContent = 'Ой! Не вдалося з\'єднатися з сервером. 😢';
        statusMsg.style.color = 'red';
    }
}