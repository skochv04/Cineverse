from django.contrib import admin
from .models import Movie
from .models import MovieCategory

admin.site.register(Movie)
admin.site.register(MovieCategory)