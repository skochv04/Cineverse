from django.urls import path
from . import views
from .views import MovieList, AvailableSeatsList, handle_request, set_csrf_token

# from .views import TestList

urlpatterns = [
    path('movies/', MovieList.as_view(), name='movie-list'),
    # path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),
	path('register/', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('available_seats/', AvailableSeatsList.as_view(), name='available-seats-list'),
	path('handle_request/', handle_request, name='handle_request'),
	path('set_csrf_token/', set_csrf_token, name='set_csrf_token'),
]