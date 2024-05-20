from django.contrib import admin
from django.urls import path, include
from . import views

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('user_api.urls')),
    path('api/', include('user_api.urls')),
    path('login/', views.index, name='login'),
    path('register/', views.index, name='register'),
    path('about_us/', views.index, name='about_us'),
    path('user_profile/', views.index, name='user_profile'),
    path('cart/', views.index, name='cart'),
    path('movie/', views.index, name='movie'),
    path('showtime/', views.index, name='showtime'),
    path('stage/', views.index, name='stage'),
    path('<path:unknown>/', views.index, name='error'),
]
