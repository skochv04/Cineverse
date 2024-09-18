from django.contrib import admin

from .models import Movie, MovieCategory, Ticket, MovieScreening
from .models import OccupiedSeat

admin.site.register(Movie)
admin.site.register(MovieCategory)
admin.site.register(MovieScreening)
admin.site.register(Ticket)
admin.site.register(OccupiedSeat)
