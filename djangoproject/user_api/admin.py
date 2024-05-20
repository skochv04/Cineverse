from django.contrib import admin
from .models import Movie
from .models import MovieCategory
from .models import TestView

admin.site.register(Movie)
admin.site.register(MovieCategory)
admin.site.register(TestView)