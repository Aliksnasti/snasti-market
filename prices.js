// =========================================================================
// prices.js — ЄДИНИЙ ЦЕНТР КЕРУВАННЯ ЦІНАМИ SNASTI-MARKET
// Зміна ціни тут автоматично оновлює її на всіх посадочних сторінках,
// у картках товарів, у модальних вікнах та в розрахунках кошика!
// =========================================================================

const SITE_PRICES = {
    1:  { price: 280 },                                                         // Ятір раколовка (40см х 80см)
    2:  { price: 420 },                                                         // Ятір раколовка (50см х 100см)
    3:  { price: 130, wholesalePrice: 90,  wholesaleQty: 20 },                  // Екран риболовний (1м х 1м)
    4:  { price: 80,  wholesalePrice: 50,  wholesaleQty: 20 },                  // Сітка доріжка (7м х 1.6м)
    5:  { price: 140, wholesalePrice: 90,  wholesaleQty: 20 },                  // Сітка доріжка «Профі» (7м х 1.6м)
    6:  { price: 600 },                                                         // Дуги на павук (1.5м х 1.5м)
    7:  { price: 80 },                                                          // Косинка риболовна (1м х 1м)
    8:  { price: 110, wholesalePrice: 80,  wholesaleQty: 20 },                  // Снасть донна «Гума» комплект
    9:  { price: 650 },                                                         // Дуги на павук (2м х 2м) з хрестовиною
    10: { price: 800 },                                                         // Дуги на павук (2.5м х 2.5м) з хрестовиною
    11: { price: 850 },                                                         // Дуги на павук (3м х 3м) з хрестовиною
    12: { price: 180 },                                                         // Павук риболовний (2м х 2м) Жилка
    13: { price: 320 },                                                         // Павук риболовний (2.5м х 2.5м) Жилка
    14: { price: 360 },                                                         // Павук риболовний (3м х 3м) Жилка
    15: { price: 180 },                                                         // Павук риболовний (2м х 2м) Нитка
    16: { price: 360 },                                                         // Павук риболовний (3м х 3м) Нитка
    17: { price: 50 },                                                          // Полотно на екран (1м х 1м)
    18: { price: 400 },                                                         // Сітка тристінна (50м х 1.5м)
    19: { price: 820 },                                                         // Сітка тристінна (100м х 1.8м)
    20: { price: 1040 },                                                        // Сітка тристінна (100м х 3м)
    21: { price: 620 },                                                         // Сітка одностінна (100м х 3м)
    22: { price: 420 },                                                         // Сітка «Фінка» одностінна (30м х 1.8м)
    23: { price: 220 },                                                         // Раколовка-парасолька (6 входів)
    24: { price: 240 },                                                         // Раколовка-парасолька (8 входів)
    25: { price: 260 },                                                         // Раколовка-парасолька (10 входів)
    26: { price: 3 },                                                           // Груз сітковий затискний (16г)
    27: { price: 420 },                                                         // Раколовка-гармошка (25х30см, 3.5м)
    28: { price: 1450 },                                                        // Торпеда для протягування сіток під кригою
    29: { price: 1200 },                                                        // Сітка-парашут (Діаметр 3.6м)
    30: { price: 1400 },                                                        // Сітка-парашут (Діаметр 4.2м)
    31: { price: 1600 },                                                        // Сітка-парашут (Діаметр 5.0м)
    32: { price: 400 },                                                         // Сітка одностінна (100м х 1.8м)
    33: { price: 180 }                                                          // Гума риболовна (амортизатор 100м)
};

// =========================================================================
// АВТОМАТИЧНИЙ ОБРОБНИК (Працює при завантаженні будь-якої сторінки)
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    for (let id in SITE_PRICES) {
        const item = SITE_PRICES[id];

        // 1. Оновлюємо ціни у внутрішньому масиві productsData (для роботи кошика)
        if (typeof productsData !== 'undefined' && productsData[id]) {
            productsData[id].price = item.price;
            if (item.wholesalePrice) {
                productsData[id].wholesalePrice = item.wholesalePrice;
                productsData[id].wholesaleQty = item.wholesaleQty;
                productsData[id].isWholesale = true;
            }
        }

        // 2. Оновлюємо ціну у картці товару та атрибут data-price (для роботи фільтра цін)
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if (card) {
            card.setAttribute('data-price', item.price);
            const priceEl = card.querySelector('.price');
            if (priceEl) {
                if (item.wholesalePrice) {
                    priceEl.innerHTML = `${item.price} грн <span class="wholesale-info">(опт: ${item.wholesalePrice} грн від ${item.wholesaleQty}шт)</span>`;
                } else {
                    priceEl.innerHTML = `${item.price} грн`;
                }
            }
        }

        // 3. Оновлюємо ціну в модальних вікнах "Детальніше" (для українських та російських версій)
        const modal = document.getElementById(`details-modal-${id}`);
        if (modal) {
            const priceParagraphs = modal.querySelectorAll('p');
            priceParagraphs.forEach(p => {
                if (p.innerHTML.includes('Ціна:') || p.innerHTML.includes('Цена:') || p.innerHTML.includes('Роздрібна ціна:') || p.innerHTML.includes('Розничная цена:')) {
                    const isUk = p.innerHTML.includes('Ціна:') || p.innerHTML.includes('Роздрібна ціна:');
                    const label = isUk ? 'Ціна:' : 'Цена:';
                    
                    if (item.wholesalePrice) {
                        const wholesaleLabel = isUk ? 'Оптова ціна:' : 'Оптовая цена:';
                        const retailLabel = isUk ? 'Роздрібна ціна:' : 'Розничная цена:';
                        const fromQtyLabel = isUk ? 'при замовленні від' : 'при заказе от';
                        p.innerHTML = `<strong>${retailLabel}</strong> ${item.price} грн. <br><strong>${wholesaleLabel}</strong> ${item.wholesalePrice} грн (${fromQtyLabel} ${item.wholesaleQty} шт).`;
                    } else {
                        p.innerHTML = `<strong>${label}</strong> ${item.price} грн.`;
                    }
                }
            });
        }
    }
});