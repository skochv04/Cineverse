from django.urls import path
from . import views
from .views import MovieList, AvailableSeatsList
# from .views import TestList

urlpatterns = [
    path('movies/', MovieList.as_view(), name='movie-list'),
    # path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),
	path('register/', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('available_seats/', AvailableSeatsList.as_view(), name='available-seats-list'),
]