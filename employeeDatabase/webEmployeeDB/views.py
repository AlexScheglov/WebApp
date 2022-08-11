from django.shortcuts import render

# Показать страницу "Сотрудники"
def employees(request):
    return render(request, 'webEmployeeDB/employees.html')


# Показать страницу "Категории"
def categories(request):
    return render(request, 'webEmployeeDB/categories.html')


# Показать страницу "Должности"
def positions(request):
    return render(request, 'webEmployeeDB/positions.html')


# Показать страницу "Ошибка"
def error(request):
    return render(request, 'webEmployeeDB/error.html')
