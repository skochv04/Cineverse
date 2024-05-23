from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    def __str__(self):
        return self.username


# -----------

class MovieCategory(models.Model):
    moviecategoryid = models.AutoField(primary_key=True)
    categoryname = models.CharField(max_length=50)

    def __str__(self):
        return self.categoryname
    
    class Meta:
        managed = False 
        db_table = 'moviecategories'


class Movie(models.Model):
    movieid = models.AutoField(primary_key=True)
    moviecategoryid = models.ForeignKey(MovieCategory, on_delete=models.CASCADE, db_column='moviecategoryid')
    title = models.CharField(max_length=40)
    startdate = models.DateField()
    enddate = models.DateField()
    duration = models.IntegerField()
    description = models.CharField(max_length=255)
    image = models.BinaryField()
    director = models.CharField(max_length=40)
    minage = models.IntegerField()
    production = models.CharField(max_length=40)
    originallanguage = models.CharField(max_length=40)
    rank = models.FloatField()

    def __str__(self):
        return self.title

    class Meta:
        managed = False 
        db_table = 'movies'

class MovieScreening(models.Model):
    moviescreeningid = models.AutoField(primary_key=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, db_column='movieid')
    date = models.DateField()
    start_time = models.TimeField(db_column='starttime')
    price_standard = models.DecimalField(max_digits=12, decimal_places=2, db_column='pricestandard')
    price_premium = models.DecimalField(max_digits=12, decimal_places=2, db_column='pricepremium')
    movie_hall = models.IntegerField(db_column='moviehall')
    three_dimensional = models.BooleanField(db_column='threedimensional')
    language = models.CharField(max_length=40)

    def __str__(self):
        return f"{self.movie.title} - {self.date} {self.start_time}"

    class Meta:
       managed = False 
       db_table = 'moviescreening'


class MovieScreeningSeat(models.Model):
    moviescreeningseatsid = models.AutoField(primary_key=True)
    movie_screening = models.ForeignKey(MovieScreening, on_delete=models.CASCADE, db_column='moviescreeningid')
    seat_number = models.IntegerField(db_column='seatnumber')
    available = models.BooleanField()

    class Meta:
        unique_together = (('movie_screening', 'seat_number'),)
        managed = False 
        db_table = 'moviescreeningseats'

    def __str__(self):
        return f"Screening: {self.movie_screening}, Seat: {self.seat_number}"


class Ticket(models.Model):
    ticketid = models.AutoField(primary_key=True)
    customer = models.ForeignKey(AppUser, on_delete=models.CASCADE, db_column='customerid')
    movie_screening = models.ForeignKey(MovieScreening, on_delete=models.CASCADE, db_column='moviescreeningid')
    seat_number = models.IntegerField(db_column='seatnumber')
    ordered_on_date = models.DateField(db_column='orderedondate')
    status = models.CharField(max_length=10)

    class Meta:
        unique_together = (('movie_screening', 'seat_number'),)
        managed = False 
        db_table = 'tickets'

    def __str__(self):
        return f"Ticket {self.ticketid} for {self.movie_screening} - Seat {self.seat_number}"


class AvailableSeat(models.Model):
    seat_number = models.IntegerField(db_column='seatnumber')
    movie_screening_id = models.ForeignKey(MovieScreening, on_delete=models.DO_NOTHING, db_column='moviescreeningid')

    def __str__(self):
        return f"Seat {self.seat_number} for {self.movie_screening_id} is available"

    class Meta:
        managed = False
        db_table = 'availableseats'