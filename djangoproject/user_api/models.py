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
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Movie(models.Model):
    movieid = models.AutoField(primary_key=True)
    moviecategoryid = models.ForeignKey(MovieCategory, on_delete=models.CASCADE)
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
    rank = models.IntegerField()

    def __str__(self):
        return self.title

class AvailableSeat(models.Model):
    seat_number = models.IntegerField()
    movie_screening_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'AvailableSeats'

class TestView(models.Model):
    id = models.BigIntegerField(primary_key=True)
    title = models.ForeignKey(Movie, on_delete=models.DO_NOTHING, db_column='title')
    name = models.ForeignKey(MovieCategory, on_delete=models.DO_NOTHING, db_column='name')

    class Meta:
        managed = False 
        db_table = 'test_view'