from django.contrib import admin
from .models import Movie, MovieCategory, Ticket, MovieScreening, MovieScreeningSeat
# from .models import TestView, 
from .models import AvailableSeat

admin.site.register(Movie)
admin.site.register(MovieCategory)
admin.site.register(MovieScreening)
admin.site.register(MovieScreeningSeat)
admin.site.register(Ticket)
# admin.site.register(TestView)
admin.site.register(AvailableSeat)