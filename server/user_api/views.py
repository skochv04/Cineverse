import base64
import datetime
import json

import jwt
from django.contrib.auth import login, logout
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from rest_framework import permissions, status, generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from djangoproject.settings import SECRET_KEY
from .models import AppUser
from .models import OccupiedSeat
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, OccupiedSeatSerializer
from .validations import custom_validation, validate_email, validate_password

specific_date = '2024-05-22'
specific_time = '13:00'


@require_GET
def get_today_screenings(request):
    try:
        # screenings = MovieScreening.objects().filter(date=specific_date)
        # screenings_data = list(screenings.values())
        # return JsonResponse(screenings_data, safe=False)
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_movie_screenings_on_date(%s)", [specific_date])
            columns = [col[0] for col in cursor.description]
            screenings = []
            for row in cursor.fetchall():
                screening = dict(zip(columns, row))
                screenings.append(screening)
        return JsonResponse(screenings, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_movie_screenings_by_hall(request):
    movie_hall = request.GET.get('number')
    hall_date = request.GET.get('date')

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM get_screenings_by_hall(%s, %s)",
                [movie_hall, hall_date]
            )
            columns = [col[0] for col in cursor.description]
            results = cursor.fetchall()

        if results:
            result_dicts = [dict(zip(columns, row)) for row in results]
            return JsonResponse(result_dicts, safe=False)
        else:
            return JsonResponse({'error': 'No results found for the given movie hall and date.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_categories_average(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM average_ticket_prices_by_category")
            columns = [col[0] for col in cursor.description]
            categories = []
            for row in cursor.fetchall():
                category = dict(zip(columns, row))
                categories.append(category)
        return JsonResponse(categories, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_movie_revenue_on_date(request):
    if request.method == 'GET':
        movie_title = request.GET.get('title')
        order_date = request.GET.get('date')

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM movies_revenue WHERE title = %s AND orderedondate = %s",
                    [movie_title, order_date]
                )
                columns = [col[0] for col in cursor.description]
                result = cursor.fetchone()

            if result:
                result_dict = dict(zip(columns, result))
                return JsonResponse(result_dict, safe=False)
            else:
                return JsonResponse({'error': 'No results found for the given movie title and date.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_movie_screenings(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT ms.*, m.title, m.image FROM movie_screening ms LEFT JOIN movies m ON m.movieid = ms.movieid order by ms.date, ms.starttime")
            columns = [col[0] for col in cursor.description]
            movies = []
            for row in cursor.fetchall():
                movie = dict(zip(columns, row))
                if movie.get('image'):
                    movie['image'] = base64.b64encode(movie['image']).decode('utf-8')
                movies.append(movie)
        return JsonResponse(movies, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_tickets_for_user(request, user_name):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT user_id FROM user_api_appuser WHERE username = %s
        """, [user_name])
        user_id_row = cursor.fetchone()
        if user_id_row is None:
            return JsonResponse({'error': 'User not found'}, status=404)
        user_id = user_id_row[0]

        cursor.execute("""
            SELECT * FROM get_tickets_for_user(%s) WHERE date >= %s
        """, [user_id, specific_date])
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return JsonResponse(results, safe=False)


@require_GET
def get_showtime(request, moviescreeningid):
    if not moviescreeningid:
        return JsonResponse({'error': 'moviescreeningid parameter is required'}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM movie_screening WHERE moviescreeningid = %s", [moviescreeningid])
            row = cursor.fetchone()
            if row:
                columns = [col[0] for col in cursor.description]
                movie_screening = dict(zip(columns, row))
                return JsonResponse(movie_screening, safe=False)
            else:
                return JsonResponse({'error': 'Movie screening not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_categories(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM movie_categories")
            columns = [col[0] for col in cursor.description]
            categories = []
            for row in cursor.fetchall():
                category = dict(zip(columns, row))
                categories.append(category)
        return JsonResponse(categories, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_movie_details(request, title):
    if not title:
        return JsonResponse({'error': 'Title parameter is required'}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_movie_by_title(%s)", [title])
            row = cursor.fetchone()
            if row:
                columns = [col[0] for col in cursor.description]
                movie = dict(zip(columns, row))
                if 'image' in movie and movie['image'] is not None:
                    movie['image'] = base64.b64encode(movie['image']).decode('utf-8')

                return JsonResponse(movie, safe=False)
            else:
                return JsonResponse({'error': 'Movie not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_movies(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT m.*, mc.categoryname FROM movies m LEFT JOIN movie_categories mc ON m.moviecategoryid = mc.moviecategoryid where m.enddate >= %s order by startdate",
                [specific_date])
            columns = [col[0] for col in cursor.description]
            movies = []
            for row in cursor.fetchall():
                movie = dict(zip(columns, row))
                if movie.get('image'):
                    movie['image'] = base64.b64encode(movie['image']).decode('utf-8')
                movies.append(movie)
        return JsonResponse(movies, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def get_current_movies(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM get_current_movies(%s)", [specific_date])
        columns = [col[0] for col in cursor.description]
        movies = []
        for row in cursor.fetchall():
            movie = dict(zip(columns, row))
            movie['image'] = base64.b64encode(movie['image']).decode('utf-8')  # Convert image to base64 string
            movies.append(movie)
    return JsonResponse(movies, safe=False)


@require_GET
def get_upcoming_movies(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM get_upcoming_movies(%s)", [specific_date])
        columns = [col[0] for col in cursor.description]
        movies = []
        for row in cursor.fetchall():
            movie = dict(zip(columns, row))
            movie['image'] = base64.b64encode(movie['image']).decode('utf-8')  # Convert image to base64 string
            movies.append(movie)
    return JsonResponse(movies, safe=False)


@require_GET
def get_movie_sessions(request, title):
    if not title:
        return JsonResponse({'error': 'Title parameter is required'}, status=400)
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM get_movie_sessions(%s, %s, %s) order by date, starttime",
                [title, specific_date, specific_time]
            )
            rows = cursor.fetchall()

        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_POST
def handle_reservation(request):
    try:
        data = json.loads(request.body)
        ticketid = data['ticketid']
        status = data['status']
        with connection.cursor() as cursor:
            cursor.execute("CALL update_ticket_status(%s, %s);", [ticketid, status])
        return JsonResponse({'message': 'Ticket status updated successfully'}, status=200)
    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_POST
def delete_movie_screening(request):
    try:
        data = json.loads(request.body)
        title = data['title']
        date = data['date']
        time = data['starttime']
        with connection.cursor() as cursor:
            cursor.execute("CALL delete_movie_screening(%s, %s, %s);", [title, date, time])
        return JsonResponse({'message': 'Movie screening deleted successfully'}, status=200)
    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


@require_POST
def handle_movie_screening(request):
    try:
        data = json.loads(request.body)
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL add_movie_screenings_weekly(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                [data['title'], data['date'], data['starttime'],
                 data['pricestandard'], data['pricepremium'], data['threedimensional'],
                 data['language'], data['moviehall'], data['repeatcount']]
            )
        return JsonResponse({'message': 'Movie screenings added successfully'}, status=201)

    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


@require_POST
def handle_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')
            if action == 'reserve_seat':
                return reserve_movie_screening_seat(data)
            elif action == 'buy_seat':
                return buy_movie_screening_seat(data)
            else:
                return JsonResponse({'error': 'Unknown action'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e).split('\n')[0]}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)


def reserve_movie_screening_seat(data):
    try:
        seat_number = data['seat_number']
        movie_screening_id = data['movie_screening_id']
        username = data['username']
        with connection.cursor() as cursor:
            cursor.execute("SELECT user_id FROM user_api_appuser WHERE username = %s", [username])
            user_id_row = cursor.fetchone()
            if user_id_row is None:
                return JsonResponse({'error': 'User not found'}, status=404)
            user_id = user_id_row[0]

            cursor.execute("CALL reserve_movie_screening_seat(%s, %s, %s, %s, %s);",
                           [user_id, seat_number, movie_screening_id, specific_date, specific_time])

        return JsonResponse({'message': 'Seat reserved successfully'}, status=201)
    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


def buy_movie_screening_seat(data):
    try:
        seat_number = data['seat_number']
        movie_screening_id = data['movie_screening_id']
        username = data['username']
        with connection.cursor() as cursor:
            cursor.execute("SELECT user_id FROM user_api_appuser WHERE username = %s", [username])
            user_id_row = cursor.fetchone()
            if user_id_row is None:
                return JsonResponse({'error': 'User not found'}, status=404)
            user_id = user_id_row[0]

            cursor.execute("CALL buy_movie_screening_seat(%s, %s, %s, %s, %s);",
                           [user_id, seat_number, movie_screening_id, specific_date, specific_time])
        return JsonResponse({'message': 'Seat bought successfully'}, status=201)
    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


def handle_movie(request):
    try:
        data = json.loads(request.body)
        if request.method == 'POST':
            with connection.cursor() as cursor:
                cursor.execute(
                    "CALL add_movie_by_name(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    [data['moviecategory'], data['title'], data['startdate'], data['enddate'],
                     data['duration'], data['description'], data['image'], data['director'],
                     data['minage'], data['production'], data['originallanguage'], data['rank']]
                )
            return JsonResponse({'message': 'Movie added successfully'}, status=201)
        elif request.method == 'PUT':
            with connection.cursor() as cursor:
                cursor.execute(
                    "CALL update_movie_by_name(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    [data['moviecategory'], data['title'], data['startdate'], data['enddate'],
                     data['duration'], data['description'], data['image'], data['director'],
                     data['minage'], data['production'], data['originallanguage'], data['rank']]
                )
            return JsonResponse({'message': 'Movie updated successfully'}, status=200)

    except KeyError as e:
        return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


@require_POST
def delete_movie_by_name(request):
    try:
        data = json.loads(request.body)
        title = data['movie_name']
        with connection.cursor() as cursor:
            cursor.execute("CALL delete_movie_by_name(%s);", [title])
        return JsonResponse({'message': 'Movie deleted successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


def handle_movie_category(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            category_name = data['category_name']
            with connection.cursor() as cursor:
                cursor.execute("CALL add_movie_category(%s);", [category_name])
            return JsonResponse({'message': 'Category added successfully'}, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e).split('\n')[0]}, status=500)

    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            category_name = data['category_name']
            with connection.cursor() as cursor:
                cursor.execute("CALL delete_movie_category(%s);", [category_name])
            return JsonResponse({'message': 'Category deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e).split('\n')[0]}, status=500)


class OccupiedSeatsList(generics.ListAPIView):
    serializer_class = OccupiedSeatSerializer

    def get_queryset(self):
        movie_screening_id = self.kwargs['movie_screening_id']
        return OccupiedSeat.objects.filter(movie_screening_id=movie_screening_id)


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            payload = {
                'id': user.user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            response = Response({
                'success': True,
                'redirect_url': '/'
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key='jwt',
                value=token,
                max_age=24 * 60 * 60,
                path='/'
            )
            return response
        return Response({
            'error': 'Failed to register',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        if not validate_email(data):
            return JsonResponse({'success': False, 'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        if not validate_password(data):
            return JsonResponse({'success': False, 'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(serializer.validated_data)
            login(request, user)
            payload = {
                'id': user.user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            response = Response({
                'success': True,
                'redirect_url': '/'
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key='jwt',
                value=token,
                max_age=24 * 60 * 60,
                path='/'
            )
            return response
        return Response({
            'error': 'Failed to log in',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return JsonResponse({'error': 'No JWT token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Invalid JWT token'}, status=status.HTTP_400_BAD_REQUEST)

        user = AppUser.objects.filter(user_id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        response = JsonResponse({'success': True, 'redirect_url': '/login'}, status=status.HTTP_200_OK)
        response.delete_cookie('jwt', path='/', domain=None)
        return response
