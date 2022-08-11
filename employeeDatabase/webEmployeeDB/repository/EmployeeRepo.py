"""
Класс для работы с таблицей 'Сотрудники', расширяе базовый класс BaseRepo
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


class EmployeeRepo(BaseRepo):

    # Получить все записи из таблицы employees и вернуть в JSON формате
    def get_all(self):
        try:
            sql_query = 'SELECT employee_id, employee_fio, age, gender, position_name, category_name ' \
                        'FROM employees ' \
                        'INNER JOIN positions p on employees.position_fk = p.position_id ' \
                        'INNER JOIN categories c on employees.category_fk = c.category_id ' \
                        'ORDER BY employee_fio'
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except Exception:
            raise

    # Получить одну записи из таблицы employees по id и вернуть в JSON формате
    def get_by_id(self, request):
        try:
            employee_id = int(self.convert_json_to_rows(request)[0]['employee_id'])
            sql_query = sql.SQL(
                'SELECT employee_id, employee_fio, age, gender, position_name, category_name ' \
                'FROM employees ' \
                'INNER JOIN positions p on employees.position_fk = p.position_id ' \
                'INNER JOIN categories c on employees.category_fk = c.category_id ' \
                'WHERE employee_id = {}').format(sql.Literal(employee_id))
            return self.convert_rows_to_json(self.execute_request(sql_query))
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Создать запись в таблице employees
    def create(self, request):
        try:
            fields = dict(self.convert_json_to_rows(request)[0])
            # Формируем списки столбцов и их значений
            columns = fields.keys()
            values = fields.values()

            for val in values:
                if val is None:
                    raise Warning("Не все поля заполненны")

            sql_query = sql.SQL('INSERT INTO employees ({col})' \
                                'VALUES ({val})').format(
                col=sql.SQL(', ').join(sql.Identifier(c) for c in columns),
                val=sql.SQL(', ').join(sql.Literal(v) for v in values)
            )
            return self.execute_request(sql_query)
        except Exception:
            raise

    # Обновить запись в таблице employees
    def update_by_id(self, request):
        try:
            fields = dict(self.convert_json_to_rows(request)[0])
            employee_id = int(fields.pop('employee_id'))

            # Формируем попарно поле и его значение
            updated_fields = []
            for column, value in fields.items():
                updated_fields.append(sql.SQL('{}={}').format(sql.Identifier(column), sql.Literal(value)))

            sql_query = sql.SQL('UPDATE employees SET {up_fil}' \
                                'WHERE employee_id = {empl_id} ').format(
                up_fil=sql.SQL(', ').join(uf for uf in updated_fields),
                empl_id=sql.Literal(employee_id)
            )
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise

    # Удалить запись в таблице employees
    def delete_by_id(self, request):
        try:
            employee_id = int(self.convert_json_to_rows(request)[0]['employee_id'])
            sql_query = sql.SQL(
                'DELETE FROM employees WHERE employee_id = {}').format(sql.Literal(employee_id))
            return self.execute_request(sql_query)
        except ValueError:
            raise ValueError('ID некорректен')
        except Exception:
            raise
