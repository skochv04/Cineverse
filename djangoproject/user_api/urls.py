from django.urls import path
from . import views
from .views import OccupiedSeatsList, handle_request, set_csrf_token, get_movie_sessions, get_movies


urlpatterns = [
	path('register/', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('occupied_seats/', OccupiedSeatsList.as_view(), name='occupied-seats-list'),
	path('handle_request/', handle_request, name='handle_request'),
	path('set_csrf_token/', set_csrf_token, name='set_csrf_token'),
	path('movies/', views.get_movies, name='movies'),
	path('movie/<str:title>/', views.get_movie_details, name='movies_details'),
	path('current-movies/', views.get_current_movies, name='current_movies'),
    path('upcoming-movies/', views.get_upcoming_movies, name='upcoming_movies'),
	path('get_movie_sessions/', views.get_movie_sessions, name='get_movie_sessions'),
]