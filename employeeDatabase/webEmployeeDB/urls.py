"""employeeDatabase URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url
from . import views
from .commonController import CommonController as Controller
from .repository.CategoryRepo import CategoryRepo
from .repository.EmployeeRepo import EmployeeRepo
from .repository.PositionRepo import PositionRepo

# Создаем контроллеры и передаем в них ребзитории для работы с базой
employeeController = Controller(EmployeeRepo())
categoryController = Controller(CategoryRepo())
positionController = Controller(PositionRepo())

urlpatterns = [
    # Views
    url(r'^$', views.employees, name='employees'),
    url(r'^categories$', views.categories, name='categories'),
    url(r'^positions$', views.positions, name='positions'),
    url(r'^error$', views.error, name='error'),
    # Employees API
    url(r'^api/employee/update$', employeeController.update_by_id),
    url(r'^api/employee/create$', employeeController.create),
    url(r'^api/employee/get_all$', employeeController.get_all),
    url(r'^api/employee/get_by_id', employeeController.get_by_id),
    url(r'^api/employee/delete$', employeeController.delete_by_id),
    # Categories API
    url(r'^api/category/update$', categoryController.update_by_id),
    url(r'^api/category/create$', categoryController.create),
    url(r'^api/category/get_all$', categoryController.get_all),
    url(r'^api/category/get_by_id', categoryController.get_by_id),
    url(r'^api/category/delete$', categoryController.delete_by_id),
    # Positions API
    url(r'^api/position/update$', positionController.update_by_id),
    url(r'^api/position/create$', positionController.create),
    url(r'^api/position/get_all$', positionController.get_all),
    url(r'^api/position/get_by_id', positionController.get_by_id),
    url(r'^api/position/delete$', positionController.delete_by_id),
]
