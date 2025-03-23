import React, { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import cookies from "react-modal/lib/helpers/classList.js";
import Cookies from "js-cookie";

const initialState = {
    isLogin: false,
    username: '',
    currentMovies: [],
    upcomingMovies: [],
    movies: [],
    categories: [],
    tickets: []
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('username', action.payload.username);
            return { ...state, isLogin: true, username: action.payload.username };
        case 'LOGOUT':
            localStorage.removeItem('isLogin');
            localStorage.removeItem('username');
            Cookies.remove('jwt');
            return { ...state, isLogin: false, username: '', tickets: [] };
        case 'SET_CURRENT_MOVIES':
            return { ...state, currentMovies: action.payload.currentMovies };
        case 'SET_UPCOMING_MOVIES':
            return { ...state, upcomingMovies: action.payload.upcomingMovies };
        case 'SET_MOVIES':
            return { ...state, movies: action.payload.movies };
        case 'SET_TICKETS':
            return { ...state, tickets: action.payload.tickets };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload.categories };
        default:
            return state;
    }
};

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin') === 'true';
        const username = localStorage.getItem('username') || 'NewComer';
        if (isLogin) {
            dispatch({ type: 'LOGIN', payload: { username } });
        }
    }, [])

    useEffect(() => {
        const fetchCurrentMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/current-movies');
                const soonMoviesSlides = response.data.map(movie => ({
                    content: movie.title,
                    imageUrl: `data:image/jpeg;base64,${movie.image}`
                }));
                dispatch({ type: 'SET_CURRENT_MOVIES', payload: { currentMovies: soonMoviesSlides } });
            } catch (error) {
                console.error('Error fetching current movies:', error);
            }
        };

        const fetchUpcomingMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/upcoming-movies');
                const nowPlayingMoviesSlides = response.data.map(movie => ({
                    content: movie.title,
                    imageUrl: `data:image/jpeg;base64,${movie.image}`
                }));
                dispatch({ type: 'SET_UPCOMING_MOVIES', payload: { upcomingMovies: nowPlayingMoviesSlides } });
            } catch (error) {
                console.error('Error fetching upcoming movies:', error);
            }
        };

        fetchCurrentMovies();
        fetchUpcomingMovies();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/movies');
                dispatch({ type: 'SET_MOVIES', payload: { movies: response.data } });
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories');
                dispatch({ type: 'SET_CATEGORIES', payload: { categories: response.data } });
            } catch (error) {
                console.error('Error fetching movie categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (!state.isLogin) {
                    return;
                }

                const ticketsResponse = await axios.get(`http://127.0.0.1:8000/user/${state.username}/tickets/`);
                dispatch({ type: 'SET_TICKETS', payload: { tickets: ticketsResponse.data } });
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, [state.isLogin, state.username]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};