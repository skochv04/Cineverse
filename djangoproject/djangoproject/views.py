from django.shortcuts import render
from user_api.models import Movie

def index(request):
    all_movies = Movie.objects.all
    return render(request, 'index.html', {'all' : all_movies})