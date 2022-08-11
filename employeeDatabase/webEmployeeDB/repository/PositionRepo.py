"""
Класс для работы с таблицей 'Должности', расширяе базовый класс BaseRepo
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


class PositionRepo(BaseRepo):

    # Получить все записи из таблицы positions и вернуть в JSON формате
    def get_all(self):
        try:
            sql_query = 'SELECT * FROM positions ORDER BY position_name'
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except Exception:
            raise

    # Получить одну записи из таблицы positions по id и вернуть в JSON формате
    def get_by_id(self, request):
        try:
            position_id = int(self.convert_json_to_rows(request)[0]['position_id'])
            sql_query = sql.SQL(
                'SELECT * FROM positions WHERE position_id = {}').format(sql.Literal(position_id))
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Создать запись в таблице positions
    def create(self, request):
        try:
            position_name = self.convert_json_to_rows(request)[0]['position_name']
            sql_query = sql.SQL(
                'INSERT INTO positions (position_name) '
                'VALUES ({})').format(sql.Literal(position_name))
            return self.execute_request(sql_query)
        except Exception:
            raise

    # Обновить запись в таблице positions
    def update_by_id(self, request):
        try:
            fields = self.convert_json_to_rows(request)[0]
            position_id = int(fields['position_id'])
            position_name = fields['position_name']
            sql_query = sql.SQL(
                'UPDATE positions SET position_name={pos_name}'
                'WHERE position_id = {pos_id}').format(pos_name=sql.Literal(position_name),
                                                       pos_id=sql.Literal(position_id))
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Удалить запись в таблице positions
    def delete_by_id(self, request):
        try:
            position_id = int(self.convert_json_to_rows(request)[0]['position_id'])
            sql_query = sql.SQL(
                'DELETE FROM positions WHERE position_id = {}').format(sql.Literal(position_id))
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise
