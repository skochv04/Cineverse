from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user_api.urls')),
    path('', views.index, name='index'),
    path('login/', views.index, name='login'),
    path('register/', views.index, name='register'),
    path('movies/', views.index, name='movies'),
    path('about_us/', views.index, name='about_us'),
    path('user_profile/', views.index, name='user_profile'),
    path('cart/', views.index, name='cart'),
    path('movie/', views.index, name='movie'),
    path('showtime/', views.index, name='showtime'),
    path('stage/', views.index, name='stage'),
    path('<path:unknown>/', views.index, name='error'),
]
