"""
Базовый класс репозитория для подключения и взаимодействия с базой данных по средством raw-запросов.

Содержит следующие методы:

- Выполнить SQL raw-запрос и вернуть список строк
    execute_request(sql_request)

- Конвертировать строки из базы в json формат
    convert_rows_to_json(response)

- Конвертировать json формат в строки из базы
    convert_json_to_rows(request)

Так же сожержит абстрактные методы:
- Получить все записи из таблицы
    get_all()

- Получить одну записи из таблицы
    get_by_id(request)

- Создать запись в таблице
    create(request)

- Обновить запись в таблице
    update_by_id(request)

- Удалить запись в таблице
    delete_by_id(request):
"""

import json
from abc import abstractmethod

import psycopg2.extras
from contextlib import closing

from django.conf import settings
from psycopg2 import ProgrammingError


class BaseRepo:
    # Параметры подключения к базе
    connection_settings = settings.DATABASES['default']

    # Выполнить SQL запрос и вернуть список строк
    def execute_request(self, sql_request):
        try:
            # Проверить переданны ли параметры подключения к базе
            if self.connection_settings is None:
                raise Warning("Параметры подключения отсутствуют")
            else:
                # Создать подключение к базе с автозакрытиием
                with closing(
                        psycopg2.connect(dbname=self.connection_settings['NAME'], user=self.connection_settings['USER'],
                                         password=self.connection_settings['PASSWORD'],
                                         host=self.connection_settings['HOST'],
                                         port=self.connection_settings['PORT'])) as connect:
                    # Получить курсор на базу с автозакрытиием
                    with closing(connect.cursor(cursor_factory=psycopg2.extras.DictCursor)) as cursor:
                        connect.autocommit = True  # Автоматический коммит
                        cursor.execute(sql_request)  # Выполнить запрос
                        try:
                            return cursor.fetchall()  # Вернуть список строк
                        except ProgrammingError:
                            return None
        except Exception:
            raise

    # Конвертировать строки из базы в json формат
    def convert_rows_to_json(self, response):
        try:
            rows = {}
            n = 1
            if response is None:
                response = [{}]
            for row in response:
                keys = row.keys()
                record = {}
                for key in keys:
                    record.__setitem__(key, row.get(key))
                rows.__setitem__('row{}'.format(n), record)
                n += 1
            return json.dumps(rows)
        except Exception:
            raise

    # Конвертировать json формат в строки из базы
    def convert_json_to_rows(self, request):
        try:
            n = 1
            rows = []
            if request is None:
                request = {}
            dict_rows = json.loads(request)
            for row in dict_rows.keys():
                rows.append(dict_rows.get(row))
                n += 1
            return rows
        except Exception:
            raise

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def get_by_id(self, item_id):
        pass

    @abstractmethod
    def create(self, fields):
        pass

    @abstractmethod
    def update_by_id(self, fields):
        pass

    @abstractmethod
    def delete_by_id(self, item_id):
        pass
