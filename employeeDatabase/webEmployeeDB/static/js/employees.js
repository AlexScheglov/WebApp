const csrftoken = getCookie('csrftoken');   // Хранит CSRF токен
let chosen_employee_id = null   // Хранит id выбранного сотрудника

// Ответы от сервера
let response_employee_json = {};
let response_category_json = {};
let response_position_json = {};

// Добавить кнопку 'Добавить сотрудника' и событие на нее
const add_employee_button = document.getElementById('add-employee-button');
add_employee_button.addEventListener('click', function () {
    chosen_employee_id = null; // Обнулим т.к. запись новая
    addOptionsToCategoryList();
    addOptionsToPositionList();
    showPage('add-employee-page');
});

// Добавить кнопку 'Редактировать' и событие на нее
const edit_employee_button = document.getElementById('edit-employee-button');
edit_employee_button.addEventListener('click', function () {
    let data = {'row': {'employee_id': chosen_employee_id}};
    if (chosen_employee_id !== null) {
        addOptionsToCategoryList();
        addOptionsToPositionList();
        editEmployee(data);
    }
});

// Добавить кнопку 'Удалить' и событие на нее
const delete_employee_button = document.getElementById('delete-employee-button');
delete_employee_button.addEventListener('click', function () {
    deleteEmployee(chosen_employee_id);
});

// Добавить кнопку 'Сохранить сотрудника' и событие на нее
const save_employee_button = document.getElementById('save-employee');
save_employee_button.addEventListener('click', function () {
    saveEmployee();
});

// Добавить кнопку 'Закрыть' и событие на нее
const close_button = document.getElementById('close');
close_button.addEventListener('click', function () {
    setTimeout(() => {
        location.reload();
    }, 1000);
});


// Работа с сотрудниками ----------------------------------------------------------------------------------------

// Получить сотрудлников из базы
function getEmployees() {
    sendEmployeeRequest('GET', '/api/employee/get_all');
    setTimeout(() => {
        let num_row = 1;
        for (let row in response_employee_json) {
            let employee = response_employee_json[row];
            addRowToEmployeeTable(
                num_row,
                employee['employee_id'],
                employee['employee_fio'],
                employee['age'],
                employee['gender'],
                employee['category_name'],
                employee['position_name'])
            num_row++;
        }
    }, 1000)
}

// Добавить строку в таблицу 'Сотрудники'
function addRowToEmployeeTable(num_row, employee_id, employee_fio, age, gender, category_name, position_name) {
    // Создание строки в таблице
    let tbody = document.getElementById('employees-table').getElementsByTagName('tbody')[0];
    let row = document.createElement('tr');
    row.addEventListener('click', function () {
        changeColorOfSelectedRow(this)
        chosen_employee_id = this.getElementsByTagName('td')[1].innerText;
    });

    let td0 = document.createElement('td');
    td0.appendChild(document.createTextNode(num_row));
    let td1 = document.createElement('td');
    td1.appendChild(document.createTextNode(employee_id));
    td1.setAttribute('id', 'employee_id')
    td1.setAttribute('hidden', 'true')
    let td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(employee_fio));
    let td3 = document.createElement('td');
    td3.appendChild(document.createTextNode(age));
    let td4 = document.createElement('td');
    td4.appendChild(document.createTextNode(gender));
    let td5 = document.createElement('td');
    td5.appendChild(document.createTextNode(category_name));
    let td6 = document.createElement('td');
    td6.appendChild(document.createTextNode(position_name));

    row.appendChild(td0);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    row.appendChild(td6);
    tbody.appendChild(row);
}

// Сохранить сотрудника
function saveEmployee() {
    let employee_fio = document.getElementById('employee_fio');
    let age = document.getElementById('age');
    let gender = document.getElementById('gender');
    let category_name = document.getElementById('category_name');
    let position_name = document.getElementById('position_name');

    // Валидация полей
    let fields = [employee_fio, age, category_name, position_name]
    let check = 0
    for (let n in fields) {
        if (fields[n].validity.valid) {
            if (fields[n].classList.contains('is-invalid')) fields[n].classList.remove('is-invalid')
        } else {
            fields[n].classList.add('is-invalid')
            check ++
        }
    }
    if (check > 0) return

    // Формируем данные для отправки
    let data = {
        'row': {
            'employee_fio': employee_fio.value,
            'age': age.value,
            'gender': gender.value,
            'category_fk': category_name.selectedOptions[0].id,
            'position_fk': position_name.selectedOptions[0].id
        }
    }

    if (chosen_employee_id === null) {
        sendEmployeeRequest('POST', '/api/employee/create', data);
    } else {
        data.row.employee_id = chosen_employee_id;  // Если мы изменяем данные сотруника, то добавим к данным его id
        sendEmployeeRequest('PUT', '/api/employee/update', data);
    }

    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Редактировать сотрудника
function editEmployee(data) {
    let employee_fio = document.getElementById('employee_fio');
    let age = document.getElementById('age');
    let gender = document.getElementById('gender');
    let category_name = document.getElementById('category_name');
    let position_name = document.getElementById('position_name');

    sendEmployeeRequest('POST', '/api/employee/get_by_id', data);
    setTimeout(() => {
        employee_fio.value = response_employee_json.row1.employee_fio;
        age.value = response_employee_json.row1.age;
        let genders = gender.getElementsByTagName('option');
        for (let n in genders) {
            if (genders[n].text === response_employee_json.row1.gender) {
                genders[n].setAttribute('selected', 'true')
            }
        }
        let category_names = category_name.getElementsByTagName('option');
        for (let n in category_names) {
            if (category_names[n].text === response_employee_json.row1.category_name) {
                category_names[n].setAttribute('selected', 'true')
            }
        }
        let position_names = position_name.getElementsByTagName('option');
        for (let n in position_names) {
            if (position_names[n].text === response_employee_json.row1.position_name) {
                position_names[n].setAttribute('selected', 'true')
            }
        }
        showPage('add-employee-page');
    }, 1000);
}

// Удалить сотрудника из базы
function deleteEmployee(employee_id) {
    let data = {'row': {'employee_id': employee_id}};
    if (employee_id !== null) {
        if (confirm('Вы действительно хотите удалить этого сотрудника?')) {
            sendEmployeeRequest('DELETE', '/api/employee/delete', data);
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
}

// Остальной функционал -----------------------------------------------------------------------------------------------

// Послать запрос по "Сотрудник"
async function sendEmployeeRequest(method, url, body = null) {

    const data = JSON.stringify(body);
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);

    xhr.onload = () => {
        if (xhr.status <= 300) {
            if (xhr.status == 200) response_employee_json = JSON.parse(xhr.responseText)
        } else {
            showError(xhr)
        }
    };
    xhr.send(data);
}

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

// Добавить пункты выбора в выподающее меню "Категория"
function addOptionsToCategoryList() {
    let categories_list = document.getElementById('category_name');
    sendCategoryRequest('GET', '/api/category/get_all');
    setTimeout(() => {
        for (let row in response_category_json) {
            let category = response_category_json[row];
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(category['category_name']));
            option.setAttribute('id', category['category_id']);
            categories_list.appendChild(option);
        }
    }, 1000);
}

// Добавить пункты выбора в выподающее меню "Должность"
function addOptionsToPositionList() {
    let positions_list = document.getElementById('position_name');
    // let positions_request =
    sendPositionRequest('GET', '/api/position/get_all');
    setTimeout(() => {
        for (let row in response_position_json) {
            let position = response_position_json[row];
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(position['position_name']));
            option.setAttribute('id', position['position_id']);
            positions_list.appendChild(option);
        }
    }, 1000);
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
getEmployees();