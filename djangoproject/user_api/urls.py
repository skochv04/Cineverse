from django.urls import path
from . import views
from .views import OccupiedSeatsList, handle_request, set_csrf_token
from .views import handle_movie_category, delete_movie_by_name, handle_movie, handle_movie_screening, delete_movie_screening, handle_reservation
from .views import get_movie_revenue_on_date

urlpatterns = [
	path('register/', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('handle_request/', handle_request, name='handle_request'),
	path('set_csrf_token/', views.set_csrf_token, name='set_csrf_token'),
	path('movies/', views.get_movies, name='movies'),
	path('categories/', views.get_categories, name='categories'),
	path('movie/<str:title>/', views.get_movie_details, name='movies_details'),
	path('showtime/<int:moviescreeningid>/', views.get_showtime, name='showtime'),
	path('movie_sessions/<str:title>/', views.get_movie_sessions, name='movie_sessions'),
	path('current-movies/', views.get_current_movies, name='current_movies'),
    path('upcoming-movies/', views.get_upcoming_movies, name='upcoming_movies'),
	path('occupied_seats/<int:movie_screening_id>/', OccupiedSeatsList.as_view(), name='occupied-seats-list'),
	path('user/<int:user_id>/tickets/', views.get_tickets_for_user, name='get_tickets_for_user'),
	path('handle_movie_category/', handle_movie_category, name='handle_movie_category'),
	path('delete_movie_by_name/', delete_movie_by_name, name='delete_movie_by_name'),
	path('handle_movie/', handle_movie, name='handle_movie'),
	path('handle_movie_screening/', handle_movie_screening, name='handle_movie_screening'),
	path('delete_movie_screening/', delete_movie_screening, name='delete_movie_screening'),
	path('movie-screenings/', views.get_movie_screenings, name='movie-screenings'),
	path('handle_reservation/', handle_reservation, name='handle_reservation'),
	path('movies-revenue/', get_movie_revenue_on_date, name='movies-revenue'),
	path('categories-average/', views.get_categories_average, name='categories-average'),
	path('hall/', views.get_movie_screenings_by_hall, name='hall'),
	path('today-screenings/', views.get_today_screenings, name='today-screenings'),
]