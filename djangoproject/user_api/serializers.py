from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError
from .models import Movie, OccupiedSeat

UserModel = get_user_model()

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = (
            'movieid', 'moviecategoryid', 'title', 'startdate', 'enddate', 'duration', 'description', 'image',
            'director',
            'minage', 'production', 'originallanguage', 'rank')


class OccupiedSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupiedSeat
        fields = ('seat_number', 'movie_screening_id')

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username']  # Додано username
        )
        return user_obj

class UserLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()
	##
	def check_user(self, clean_data):
		user = authenticate(username=clean_data['email'], password=clean_data['password'])
		if not user:
			raise ValidationError('user not found')
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')