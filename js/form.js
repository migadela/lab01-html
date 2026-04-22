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
// js/form.js

// Функція для форми додавання товару
// js/form.js

function initAdminForm() {
    const form = document.getElementById('add-item-form');
    const feedbackMsg = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        feedbackMsg.textContent = 'Зберігаємо... ⏳';
        feedbackMsg.style.color = '#5c4033';

        // Перевіряємо, чи ми в режимі редагування (чи є збережений ID)
        const editId = form.getAttribute('data-edit-id'); 
        
        const newItem = {
            title: document.getElementById('item-title').value.trim(),
            price: Number(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            image: document.getElementById('item-image').value.trim(),
            description: document.getElementById('item-desc').value.trim(),
            fullDescription: document.getElementById('item-desc').value.trim()
        };

        try {
            if (editId) {
                // Якщо є editId — оновлюємо існуючий товар (PATCH)
                await updateItem(editId, newItem);
                
                // Виходимо з режиму редагування
                form.removeAttribute('data-edit-id'); 
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.textContent = '➕ Додати в меню';
                submitBtn.style.background = '#d35400';
            } else {
                // Якщо editId немає — створюємо новий товар (POST)
                await createItem(newItem);
            }

            feedbackMsg.textContent = '✅ Зміни успішно збережено!';
            feedbackMsg.style.color = 'green';
            form.reset(); 
            await initCatalogPage(); // Оновлюємо каталог

            setTimeout(() => { feedbackMsg.textContent = ''; }, 3000);

        } catch (error) {
            console.error(error);
            feedbackMsg.textContent = '❌ Помилка при збереженні.';
            feedbackMsg.style.color = 'red';
        }
    });
}