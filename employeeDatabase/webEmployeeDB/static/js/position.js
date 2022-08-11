const csrftoken = getCookie('csrftoken');   // Хранит CSRF токен
let chosen_position_id = null   // Хранит id выбранной категории

// Ответ от сервера
let response_position_json = {};

// Добавить кнопку 'Добавить должность' и событие на нее
const add_position_button = document.getElementById('add-position-button');
add_position_button.addEventListener('click', function () {
    chosen_position_id = null; // Обнулим т.к. запись новая
    showPage('add-position-page');
});

// Добавить кнопку 'Редактировать' и событие на нее
const edit_position_button = document.getElementById('edit-position-button');
edit_position_button.addEventListener('click', function () {
    let data = {'row': {'position_id': chosen_position_id}};
    if (chosen_position_id !== null) {
        editPosition(data);
    }
});

// Добавить кнопку 'Удалить' и событие на нее
const delete_position_button = document.getElementById('delete-position-button');
delete_position_button.addEventListener('click', function () {
    deletePosition(chosen_position_id);
});

// Добавить кнопку 'Сохранить одлжность' и событие на нее
const save_position_button = document.getElementById('save-position');
save_position_button.addEventListener('click', function () {
    savePosition();
});

// Добавить кнопку 'Закрыть' и событие на нее
const close_button = document.getElementById('close');
close_button.addEventListener('click', function () {
    setTimeout(() => {
        location.reload();
    }, 1000);
});

// Работа с должностями ----------------------------------------------------------------------------------------

// Получить должности из базы
function getPositions() {
    sendPositionRequest('GET', '/api/position/get_all');
    setTimeout(() => {
        let num_row = 1;
        for (let row in response_position_json) {
            let position = response_position_json[row];
            addRowToPositionTable(
                num_row,
                position['position_id'],
                position['position_name']
            )
            num_row++;
        }
    }, 1000)
}

// Добавить строку в таблицу 'Должность'
function addRowToPositionTable(num_row, position_id, position_name) {
    // Создание строки в таблице
    let tbody = document.getElementById('positions-page').getElementsByTagName('tbody')[0];
    let row = document.createElement('tr');
    row.addEventListener('click', function () {
        changeColorOfSelectedRow(this)
        chosen_position_id = this.getElementsByTagName('td')[1].innerText;
    });

    let td0 = document.createElement('td');
    td0.appendChild(document.createTextNode(num_row));
    let td1 = document.createElement('td');
    td1.appendChild(document.createTextNode(position_id));
    td1.setAttribute('id', 'position_id')
    td1.setAttribute('hidden', 'true')
    let td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(position_name));

    row.appendChild(td0);
    row.appendChild(td1);
    row.appendChild(td2);
    tbody.appendChild(row);
}

// Сохранить должность
function savePosition() {
    let position_name = document.getElementById('position-name');

    // Валидация поля
    if (position_name.validity.valid) {
        if (position_name.classList.contains('is-invalid')) position_name.classList.remove('is-invalid')
    } else {
        position_name.classList.add('is-invalid')
        return;
    }

    // Формируем данные для отправки
    let data = {
        'row': {
            'position_name': position_name.value
        }
    }

    if (chosen_position_id === null) {
        sendPositionRequest('POST', '/api/position/create', data);
    } else {
        data.row.position_id = chosen_position_id;  // Если мы изменяем название должности, то добавим к данным ее id
        sendPositionRequest('PUT', '/api/position/update', data);
    }

    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Редактировать должность
function editPosition(data) {
    let position_name = document.getElementById('position-name');

    sendPositionRequest('POST', '/api/position/get_by_id', data);
    setTimeout(() => {
        position_name.value = response_position_json.row1.position_name;
        showPage('add-position-page');
    }, 1000);
}

// Удалить должность из базы
function deletePosition(position_id) {
    let data = {'row': {'position_id': position_id}};
    if (position_id !== null) {
        if (confirm('Вы действительно хотите удалить эту должность?')) {
            sendPositionRequest('DELETE', '/api/position/delete', data);
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
}

// Остальной функционал -----------------------------------------------------------------------------------------------

// Послать запрос по "Должность"
async function sendPositionRequest(method, url, body = null) {

    const data = JSON.stringify(body);
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);

    xhr.onload = () => {
        if (xhr.status <= 300) {
            if (xhr.status == 200) response_position_json = JSON.parse(xhr.responseText)
        } else {
            showError(xhr)
        }
    };
    xhr.send(data);
}

// Показать ошибку
function showError(response) {
    localStorage.setItem('error-status', response.status);
    localStorage.setItem('error-description', response.responseText);
    window.location.href = 'error';
}

// Изменить цвет выбранной строки в таблице
function changeColorOfSelectedRow(element) {
    let rows = element.parentElement.children;
    for (let n in rows) {
        let row = rows.item(n);
        if (row.classList.contains('table-success')) {
            row.classList.remove('table-success');
        }
    }
    element.classList.add('table-success')
}

// Показать страницу
function showPage(page_name) {
    let pages = document.getElementsByClassName('page')
    for (let n in pages) {
        let page = pages[n];
        if (page_name === page.getAttribute('id')) {
            page.classList.remove('visually-hidden');
        } else {
            if (!page.classList.contains('visually-hidden')) page.classList.add('visually-hidden')
        }
    }
}

// Получить куки
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Вызывам при загрузке/перезагрузке страницы
getPositions();