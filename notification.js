// Обработчик клика на кнопке "ОК"
document.querySelector('.notification__form button').addEventListener('click', function() {
    let time = document.querySelector('.notification__form input').value;
    let msg = document.querySelector('.notification__form textarea').value;
    let info = document.querySelector('.notification__info');

    if (!time || !msg) {
        info.textContent = 'Укажите время и сообщение';
        info.style.opacity = 1;
        setTimeout(() => {
            info.style.opacity = 0;
        }, 2000);
        setTimeout(() => {
            info.textContent = '';
        }, 3000);
        return;
    }
    localStorage.setItem(time, msg);
    update(); // Вызов update() только здесь, так как данные изменились
});

// Обработчик клика на кнопке "Очистить список"
document.querySelector('.notification__list > button').addEventListener('click', function() {
    if (localStorage.length && confirm("Очистить список уведомлений")) {
        localStorage.clear();
        update(); // Вызов update() только здесь, так как данные изменились
    } else if (!localStorage.length) {
        alert("Уведомлений нет");
    }
});

// Функция обновления списка уведомлений
function update() {
    if (!localStorage.length) {
        document.querySelector('.notification__list').hidden = true;
    } else {
        document.querySelector('.notification__list').hidden = false;
    }
    document.querySelector('.notification__list > div').innerHTML = '';
    document.querySelector('.notification__info').textContent = '';
    for (let key of Object.keys(localStorage)) {
        document.querySelector('.notification__list > div').insertAdjacentHTML('beforeend', 
        `
        <div class="notification__item">
            <div>${key} - ${localStorage.getItem(key)}</div>
            <button data-time="${key}">&times;</button>
        </div>
        `);
    }
    document.querySelector('.notification__form input').value = '';
    document.querySelector('.notification__form textarea').value = '';
    if (document.querySelector('.audioAlert')) {
        document.querySelector('.audioAlert').remove();
    }
}

// Обработчик клика на списке уведомлений (для удаления)
document.querySelector('.notification__list').addEventListener('click', function(e) {
    if (e.target.dataset.time) {
        localStorage.removeItem(e.target.dataset.time);
        update(); // Вызов update() только здесь, так как данные изменились
    }
});

// Вызов update() при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    update();
});

// Таймер для проверки времени уведомлений
setInterval(() => {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    if (currentHour < 10) {
        currentHour = '0' + currentHour;
    }
    let currentMinutes = currentDate.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = '0' + currentMinutes;
    }
    let currentTime = `${currentHour}:${currentMinutes}`;

    for (let key of Object.keys(localStorage)) {
        if (key === currentTime) {
            document.querySelector(`button[data-time="${key}"]`).closest('.notification__item').classList.add('notification__warning');
            if (!document.querySelector('.audioAlert')) {
                document.querySelector('body').insertAdjacentHTML('afterbegin', 
                '<audio loop class="audioAlert"><source src="alert.mp3" type="audio/mpeg"></audio>');
                document.querySelector('.audioAlert').play();
            }
        }
    }
}, 1000);