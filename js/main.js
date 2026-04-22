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
    initAdminForm();
    await initCatalogPage();

}

