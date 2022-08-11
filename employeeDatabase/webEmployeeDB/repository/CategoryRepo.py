"""
Класс для работы с таблицей 'Категории', расширяе базовый класс BaseRepo
Реализует такие методы из базового класса:

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

from psycopg2 import sql
from ..repository.BaseRepo import BaseRepo


class CategoryRepo(BaseRepo):

    # Получить все записи из таблицы categories и вернуть в JSON формате
    def get_all(self):
        try:
            sql_query = 'SELECT * FROM categories ORDER BY category_name'
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except Exception:
            raise

    # Получить одну записи из таблицы categories по id и вернуть в JSON формате
    def get_by_id(self, request):
        try:
            category_id = int(self.convert_json_to_rows(request)[0]['category_id'])
            sql_query = sql.SQL(
                'SELECT * FROM categories WHERE category_id = {}').format(sql.Literal(category_id))
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Создать запись в таблице categories
    def create(self, request):
        try:
            category_name = self.convert_json_to_rows(request)[0]['category_name']
            sql_query = sql.SQL(
                'INSERT INTO categories (category_name) '
                'VALUES ({})').format(sql.Literal(category_name))
            return self.execute_request(sql_query)
        except Exception:
            raise

    # Обновить запись в таблице categories
    def update_by_id(self, request):
        try:
            fields = self.convert_json_to_rows(request)[0]
            category_id = int(fields['category_id'])
            category_name = fields['category_name']
            sql_query = sql.SQL(
                'UPDATE categories SET category_name={categ_name}'
                'WHERE category_id = {categ_id}').format(categ_name=sql.Literal(category_name),
                                                         categ_id=sql.Literal(category_id))
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Удалить запись в таблице categories
    def delete_by_id(self, request):
        try:
            category_id = int(self.convert_json_to_rows(request)[0]['category_id'])
            sql_query = sql.SQL(
                'DELETE FROM categories WHERE category_id = {}').format(sql.Literal(category_id))
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise
