document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots-container');
    const totalSlides = slides.length;

    // Создание точек
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Показать слайд
    function showSlide(index) {
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });
        dots.forEach((dot) => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Переход к выбранному слайду
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    // Следующий слайд
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Предыдущий слайд
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Автопереключение (каждые 8 секунд)
    setInterval(nextSlide, 8000);

    // Инициализация первого слайда
    showSlide(currentSlide);

    // Назначение событий на кнопки
    document.querySelector('.prev').addEventListener('click', prevSlide);
    document.querySelector('.next').addEventListener('click', nextSlide);
});

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');

    // Открытие/закрытие бургер-меню
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const callbackModal = document.getElementById('callback-modal');
    const openModalButton = document.querySelector('.callback-button');
    const closeModalButton = document.getElementById('close-modal');
    const callbackForm = document.getElementById('callback-form');
    const phoneInput = document.getElementById('phone');



    // Проверяем, загружается ли скрипт
    console.log('Скрипт загружен');

    // Открытие модального окна
    openModalButton.addEventListener('click', (event) => {
        event.preventDefault(); // Останавливаем действие по умолчанию
        console.log('Открытие модального окна');
        callbackModal.style.display = 'flex';
    });

    // Закрытие модального окна
    closeModalButton.addEventListener('click', () => {
        console.log('Закрытие модального окна');
        callbackModal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    callbackModal.addEventListener('click', (e) => {
        if (e.target === callbackModal) {
            console.log('Закрытие модального окна (клик вне формы)');
            callbackModal.style.display = 'none';
        }
    });

    // Отправка формы
    callbackForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Предотвращаем стандартную отправку формы
        console.log('Форма отправлена');

        const formData = new FormData(callbackForm);
        const data = Object.fromEntries(formData.entries());

        // Очистка номера телефона от лишних символов
        const phone = data.phone.replace(/\D/g, ''); // Убираем всё, кроме цифр
        console.log('Очищенный номер телефона:', phone);

        // Отправка данных на сервер
        fetch('send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ ...data, phone }).toString(),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }
            return response.text();
        })
        .then(result => {
            console.log('Результат:', result);
            alert(result);
            callbackModal.style.display = 'none';
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка. Попробуйте ещё раз.');
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    let cart = {}; // Объект для хранения корзины

    // Функция для обновления отображения корзины
    function updateCart() {
        // Обновляем количество товаров в корзине в навигации
        const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;

        // Обновляем список товаров в корзине
        const cartList = document.querySelector('.cart-list');
        cartList.innerHTML = ''; // Очищаем текущие товары в корзине

        let totalPrice = 0;

        for (let [id, quantity] of Object.entries(cart)) {
            const product = document.querySelector(`[data-id="${id}"]`);
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseInt(product.querySelector('.price').textContent.replace(' ₽', ''), 10);
            const totalProductPrice = productPrice * quantity;
            totalPrice += totalProductPrice;

            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `${productName} - ${quantity} x ${productPrice} ₽ = ${totalProductPrice} ₽`;
            cartList.appendChild(cartItem);
        }

        // Обновляем общую сумму
        document.getElementById('cart-total').textContent = totalPrice + ' ₽';

        // Обновление кнопок "Купить"
        document.querySelectorAll('.product-card').forEach(card => {
            const buyButton = card.querySelector('.buy-button');
            const productId = card.getAttribute('data-id');

            if (cart[productId]) {
                buyButton.textContent = cart[productId]; // Показываем количество
            } else {
                buyButton.textContent = 'Купить'; // Показываем исходную кнопку
            }
        });
    }

    // Обработчик событий для кнопки "Купить"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productId = card.getAttribute('data-id');

            // Если товар уже в корзине, увеличиваем количество
            if (cart[productId]) {
                cart[productId]++;
            } else {
                cart[productId] = 1; // Если товара еще нет в корзине, добавляем его
            }

            // Обновляем корзину
            updateCart();
        });
    });

    // Добавляем уникальные ID для каждого товара в HTML (для использования в корзине)
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.setAttribute('data-id', `product-${index + 1}`);
    });

    // Функция для открытия корзины
    document.querySelector('.cart-button').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'flex';
    });

    // Функция для закрытия корзины
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // Инициализация корзины
    updateCart();
});


document.addEventListener('DOMContentLoaded', () => {
    let cart = {}; // Объект для хранения корзины

    // Функция для обновления отображения корзины
    function updateCart() {
        const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;

        const cartList = document.querySelector('.cart-list');
        cartList.innerHTML = ''; // Очищаем текущие товары в корзине

        let totalPrice = 0;

        for (let [id, quantity] of Object.entries(cart)) {
            const product = document.querySelector(`[data-id="${id}"]`);
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseInt(product.querySelector('.price').textContent.replace(' ₽', ''), 10);
            const totalProductPrice = productPrice * quantity;
            totalPrice += totalProductPrice;

            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `${productName} - ${quantity} x ${productPrice} ₽ = ${totalProductPrice} ₽`;
            cartList.appendChild(cartItem);
        }

        document.getElementById('cart-total').textContent = totalPrice + ' ₽';

        // Обновление кнопок "Купить"
        document.querySelectorAll('.product-card').forEach(card => {
            const buyButton = card.querySelector('.buy-button');
            const productId = card.getAttribute('data-id');

            if (cart[productId]) {
                buyButton.textContent = cart[productId];
            } else {
                buyButton.textContent = 'Купить';
            }
        });
    }

    // Открытие формы оформления заказа
    document.getElementById('checkout-button').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none'; // Закрыть корзину
        document.getElementById('order-modal').style.display = 'flex'; // Открыть форму заказа
    });

    // Закрытие формы оформления заказа
    document.getElementById('close-order').addEventListener('click', () => {
        document.getElementById('order-modal').style.display = 'none';
    });

    // Обработчик для кнопки "Купить"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productId = card.getAttribute('data-id');

            if (cart[productId]) {
                cart[productId]++;
            } else {
                cart[productId] = 1;
            }

            updateCart();
        });
    });

    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.setAttribute('data-id', `product-${index + 1}`);
    });

    // Инициализация корзины
    updateCart();
});
