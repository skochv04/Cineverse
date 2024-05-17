from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),  # Головна сторінка
    path('login/', views.index, name='login'),  # Сторінка входу
    path('register/', views.index, name='register'),  # Сторінка реєстрації
    path('movies/', views.index, name='movies'),  # Сторінка фільмів
    path('about_us/', views.index, name='about_us'),  # Сторінка "Про нас"
    path('user_profile/', views.index, name='user_profile'),  # Сторінка користувацького профілю
    path('cart/', views.index, name='cart'),  # Сторінка кошика
    path('movie/', views.index, name='movie'),  # Сторінка фільму
    path('showtime/', views.index, name='showtime'),  # Сторінка розкладу сеансів
    path('stage/', views.index, name='stage'),  # Сторінка сцени
    path('<path:unknown>/', views.index, name='error'),  # Сторінка помилки для невідомих URL
]
