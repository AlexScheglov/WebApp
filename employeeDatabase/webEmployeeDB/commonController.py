"""
Класс контроллер обеспечивает обработку запросов от клиента к серверу.
Создает некий API. В качестве пораметра в конструкторе принимает экземпляр класса репозитория
наследованного от класса BaseRepo
"""

from django.http import HttpResponse
from psycopg2.errors import ForeignKeyViolation


class CommonController:
    repository = None

    def __init__(self, repository):
        self.repository = repository

    def create(self, request):
        try:
            if request.method == 'POST':
                new_entry = request.body.decode()
                self.repository.create(new_entry)
            return HttpResponse(status=201)
        except Exception as e:
            return HttpResponse(e, status=500)

    def update_by_id(self, request):
        try:
            if request.method == 'PUT':
                updated_entry = request.body.decode()
                self.repository.update_by_id(updated_entry)
            return HttpResponse(status=201)
        except Exception as e:
            return HttpResponse(e, status=500)

    def get_all(self, request):
        try:
            entries = {}
            if request.method == 'GET':
                entries = self.repository.get_all()
            return HttpResponse(entries, content_type='application/json')
        except Exception as e:
            return HttpResponse(e, status=500)

    def get_by_id(self, request):
        try:
            entry = {}
            if request.method == 'POST':
                entry_id = request.body.decode()
                entry = self.repository.get_by_id(entry_id)
            return HttpResponse(entry, content_type='application/json')
        except Exception as e:
            return HttpResponse(e, status=500)

    def delete_by_id(self, request):
        try:
            if request.method == 'DELETE':
                entry_id = request.body.decode()
                self.repository.delete_by_id(entry_id)
                return HttpResponse(status=201)
        except ForeignKeyViolation as e:
            return HttpResponse(e, status=500)
