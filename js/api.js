// js/api.js

// Це адреса нашого локального сервера
const API_URL = 'http://localhost:3000/items';

// 1. Отримати всі товари (GET)
async function getItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Не вдалося отримати список товарів');
        return await response.json();
    } catch (error) {
        console.error('Помилка GET:', error);
        throw error; // Передаємо помилку далі, щоб показати її користувачу
    }
}

// 2. Створити новий товар (POST)
async function createItem(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Не вдалося створити запис');
        return await response.json();
    } catch (error) {
        console.error('Помилка POST:', error);
        throw error;
    }
}

// 3. Оновити товар (PATCH)
async function updateItem(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Не вдалося оновити запис');
        return await response.json();
    } catch (error) {
        console.error('Помилка PATCH:', error);
        throw error;
    }
}

// 4. Видалити товар (DELETE)
async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Не вдалося видалити запис');
    } catch (error) {
        console.error('Помилка DELETE:', error);
        throw error;
    }
}