from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Movie, AvailableSeat
# from .models import  AvailableSeat, TestView
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, MovieSerializer, AvailableSeatSerializer
# from .serializers import , TestViewSerializer
from rest_framework import permissions, status, generics
from .validations import custom_validation, validate_email, validate_password

# class TestList(generics.ListCreateAPIView):
#     queryset = TestView.objects.all()
#     serializer_class = TestViewSerializer

class MovieList(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class AvailableSeatsList(generics.ListAPIView):
    queryset = AvailableSeat.objects.all()
    serializer_class = AvailableSeatSerializer

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            login(request, user)
            return JsonResponse({'success': True, 'redirect_url': '/'}, status=status.HTTP_201_CREATED)
        return JsonResponse({'success': False, 'error': 'Failed to register'}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        if not validate_email(data):
            return JsonResponse({'success': False, 'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        if not validate_password(data):
            return JsonResponse({'success': False, 'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return JsonResponse({'success': True, 'redirect_url': '/'}, status=status.HTTP_200_OK)
        return JsonResponse({'success': False, 'error': 'Failed to log in'}, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        return JsonResponse({'success': True, 'redirect_url': '/login'}, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
