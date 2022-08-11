-- Удалить старые данные если они есть
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS positions;
DROP DATABASE IF EXISTS employeeDB;

-- Создать базу данных "Сотрудники"
CREATE DATABASE employeeDB
    ENCODING = 'UTF8';

-- Создать таблицу "Категории"
CREATE TABLE categories
(
    category_id   serial      NOT NULL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

-- Создать таблицу "Должности"
CREATE TABLE positions
(
    position_id   serial      NOT NULL PRIMARY KEY,
    position_name VARCHAR(50) NOT NULL
);

-- Создать таблицу "Сотрудники"
CREATE TABLE employees
(
    employee_id  serial      NOT NULL PRIMARY KEY,
    employee_fio VARCHAR(50) NOT NULL,
    age          INT         NOT NULL,
    gender       VARCHAR(10) NOT NULL,
    category_fk  INT         NOT NULL,
    position_fk  INT         NOT NULL,
    FOREIGN KEY (category_fk)
        REFERENCES categories (category_id),
    FOREIGN KEY (position_fk)
        REFERENCES positions (position_id)

);

-- Заполнение базы
-- Заполнить таблицу "Категории"
INSERT INTO categories (category_name)
VALUES ('Высшая'),
       ('Первая'),
       ('Вторая'),
       ('Третья');

-- Заполнить таблицу "Должности"
INSERT INTO positions (position_name)
VALUES ('Руководитель'),
       ('Специалист'),
       ('Служащий'),
       ('Рабочий');

-- Заполнить таблицу "Сотрудники"
INSERT INTO employees (employee_fio, age, gender, position_fk, category_fk)
VALUES ('Тетерина Елена Евгеньевна', '50', 'Мужской', '3', '4'),
       ('Логинова Анфиса Фёдоровна', '40', 'Мужской', '1', '2'),
       ('Новиков Ананий Иванович', '56', 'Женский', '1', '2'),
       ('Лебедев Август Иванович', '61', 'Мужской', '1', '2'),
       ('Волкова Ярослава Александровна', '59', 'Мужской', '2', '3'),
       ('Александрова Инга Александровна', '45', 'Женский', '4', '4'),
       ('Одинцов Мирослав Борисович', '18', 'Мужской', '2', '4'),
       ('Громова Мария Владимировна', '24', 'Женский', '4', '1'),
       ('Крылова Раиса Александровна', '36', 'Мужской', '1', '4'),
       ('Воронцова Изольда Андреевна', '59', 'Мужской', '2', '3'),
       ('Петрова Ника Александровна', '44', 'Мужской', '4', '3'),
       ('Николаев Леонид Владимирович', '37', 'Мужской', '2', '4'),
       ('Константинова Зоя Романовна', '40', 'Мужской', '2', '1'),
       ('Сергеев Стефан Андреевич', '32', 'Женский', '2', '3'),
       ('Пахомов Гордей Романович', '60', 'Женский', '3', '3'),
       ('Григорьева Вероника Романовна', '40', 'Женский', '1', '2'),
       ('Герасимова Владлена Дмитриевна', '28', 'Мужской', '3', '4'),
       ('Муравьёва Майя Андреевна', '64', 'Женский', '1', '3'),
       ('Авдеева Алиса Романовна', '40', 'Женский', '1', '2'),
       ('Никонов Максим Максимович', '63', 'Женский', '1', '4'),
       ('Некрасова Инесса Романовна', '28', 'Женский', '4', '3'),
       ('Рыбаков Яков Львович', '39', 'Мужской', '4', '3'),
       ('Русаков Семён Дмитриевич', '43', 'Женский', '1', '2'),
       ('Смирнова Яна Евгеньевна', '52', 'Женский', '3', '4'),
       ('Коновалов Альберт Романович', '54', 'Женский', '4', '1'),
       ('Кириллов Роберт Александрович', '47', 'Женский', '4', '1'),
       ('Горбунова Диана Романовна', '53', 'Мужской', '2', '1'),
       ('Фомичёв Ярослав Сергеевич', '40', 'Женский', '1', '3'),
       ('Фёдорова Злата Борисовна', '50', 'Женский', '2', '2'),
       ('Герасимова Анастасия Алексеевна', '44', 'Мужской', '4', '2'),
       ('Матвеев Савва Андреевич', '54', 'Женский', '3', '3'),
       ('Тетерин Абрам Андреевич', '43', 'Мужской', '4', '4'),
       ('Панова Яна Андреевна', '51', 'Женский', '3', '4'),
       ('Хохлова Антонина Фёдоровна', '22', 'Мужской', '4', '2'),
       ('Лаврентьева Клементина Романовна', '42', 'Мужской', '3', '3'),
       ('Блинова Лилия Евгеньевна', '60', 'Женский', '4', '4'),
       ('Горбунов Павел Владимирович', '52', 'Женский', '1', '4'),
       ('Селезнёва Галина Ивановна', '63', 'Мужской', '4', '2'),
       ('Кононов Артём Евгеньевич', '60', 'Женский', '3', '1'),
       ('Никонова Полина Алексеевна', '61', 'Женский', '4', '1'),
       ('Трофимов Виталий Владимирович', '27', 'Мужской', '4', '4'),
       ('Калинина Дина Ивановна', '23', 'Женский', '1', '1'),
       ('Петухова Зинаида Фёдоровна', '48', 'Женский', '2', '2'),
       ('Матвеев Игнат Борисович', '43', 'Женский', '1', '2'),
       ('Муравьёва Вероника Фёдоровна', '56', 'Мужской', '4', '2'),
       ('Дмитриева Алина Дмитриевна', '37', 'Женский', '1', '1'),
       ('Панова Клавдия Андреевна', '55', 'Мужской', '2', '2'),
       ('Алексеева Любовь Дмитриевна', '38', 'Женский', '3', '1'),
       ('Волков Максим Александрович', '36', 'Мужской', '4', '3'),
       ('Вишнякова Эльвира Евгеньевна', '48', 'Женский', '4', '2');