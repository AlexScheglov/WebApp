const csrftoken = getCookie('csrftoken');   // Хранит CSRF токен
let chosen_category_id = null   // Хранит id выбранной категории

// Ответ от сервера
let response_category_json = {};

// Добавить кнопку 'Добавить категорию' и событие на нее
const add_category_button = document.getElementById('add-category-button');
add_category_button.addEventListener('click', function () {
    chosen_category_id = null; // Обнулим т.к. запись новая
    showPage('add-category-page');
});

// Добавить кнопку 'Редактировать' и событие на нее
const edit_category_button = document.getElementById('edit-category-button');
edit_category_button.addEventListener('click', function () {
    let data = {'row': {'category_id': chosen_category_id}};
    if (chosen_category_id !== null) {
        editCategory(data);
    }
});

// Добавить кнопку 'Удалить' и событие на нее
const delete_category_button = document.getElementById('delete-category-button');
delete_category_button.addEventListener('click', function () {
    deleteCategory(chosen_category_id);
});

// Добавить кнопку 'Сохранить категорию' и событие на нее
const save_category_button = document.getElementById('save-category');
save_category_button.addEventListener('click', function () {
    saveCategory();
});

// Добавить кнопку 'Закрыть' и событие на нее
const close_button = document.getElementById('close');
close_button.addEventListener('click', function () {
    setTimeout(() => {
        location.reload();
    }, 1000);
});

// Работа с категориями ----------------------------------------------------------------------------------------

// Получить категории из базы
function getCategories() {
    sendCategoryRequest('GET', '/api/category/get_all');
    setTimeout(() => {
        let num_row = 1;
        for (let row in response_category_json) {
            let category = response_category_json[row];
            addRowToCategoryTable(
                num_row,
                category['category_id'],
                category['category_name']
            )
            num_row++;
        }
    }, 1000)
}

// Добавить строку в таблицу 'Категория'
function addRowToCategoryTable(num_row, category_id, category_name) {
    // Создание строки в таблице
    let tbody = document.getElementById('categories-page').getElementsByTagName('tbody')[0];
    let row = document.createElement('tr');
    row.addEventListener('click', function () {
        changeColorOfSelectedRow(this)
        chosen_category_id = this.getElementsByTagName('td')[1].innerText;
    });

    let td0 = document.createElement('td');
    td0.appendChild(document.createTextNode(num_row));
    let td1 = document.createElement('td');
    td1.appendChild(document.createTextNode(category_id));
    td1.setAttribute('id', 'category_id')
    td1.setAttribute('hidden', 'true')
    let td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(category_name));

    row.appendChild(td0);
    row.appendChild(td1);
    row.appendChild(td2);
    tbody.appendChild(row);
}

// Сохранить категорию
function saveCategory() {
    let category_name = document.getElementById('category-name');

    // Валидация поля
    if (category_name.validity.valid) {
        if (category_name.classList.contains('is-invalid')) category_name.classList.remove('is-invalid')
    } else {
        category_name.classList.add('is-invalid')
        return;
    }

    // Формируем данные для отправки
    let data = {
        'row': {
            'category_name': category_name.value
        }
    }

    if (chosen_category_id === null) {
        sendCategoryRequest('POST', '/api/category/create', data);
    } else {
        data.row.category_id = chosen_category_id;  // Если мы изменяем название категории, то добавим к данным ее id
        sendCategoryRequest('PUT', '/api/category/update', data);
    }

    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Редактировать категорию
function editCategory(data) {
    let category_name = document.getElementById('category-name');

    sendCategoryRequest('POST', '/api/category/get_by_id', data);
    setTimeout(() => {
        category_name.value = response_category_json.row1.category_name;
        showPage('add-category-page');
    }, 1000);
}

// Удалить категорию из базы
function deleteCategory(category_id) {
    let data = {'row': {'category_id': category_id}};
    if (category_id !== null) {
        if (confirm('Вы действительно хотите удалить эту категорию?')) {
            sendCategoryRequest('DELETE', '/api/category/delete', data);
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
}

// Остальной функционал -----------------------------------------------------------------------------------------------

// Послать запрос по "Категория"
async function sendCategoryRequest(method, url, body = null) {

    const data = JSON.stringify(body);
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);

    xhr.onload = () => {
        if (xhr.status <= 300) {
            if (xhr.status == 200) response_category_json = JSON.parse(xhr.responseText)
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
getCategories();