import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./styles/Movie.css";
import axios from "axios";
import RankContainer from "./RankContainer.jsx";
import {format, addDays} from 'date-fns';
import Loading from "./Loading.jsx";
import {AuthContext} from "../contexts/AuthContext.jsx";

const initialDate = new Date(2024, 4, 22);

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Movie() {
    const {title} = useParams();
    const {state} = useContext(AuthContext);
    const isLogin = state.isLogin;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableShowTime, setAvailableShowTime] = useState([]);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const showtimeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieResponse = await client.get(`/api/movie/${title}`);
                setMovie(movieResponse.data);
                const showTimeResponse = await client.get(`/api/movie_sessions/${title}`);
                setAvailableShowTime(showTimeResponse.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [title]);

    if (loading) return <Loading/>;
    if (error) return <p>Error fetching movie details: {error.message}</p>;

    const scrollToShowtime = () => {
        if (showtimeRef.current) {
            showtimeRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };
    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const filteredShowTimes = availableShowTime.filter(showtime =>
        new Date(showtime.date).toDateString() === selectedDate.toDateString()
    );

    const handleBuyTicket = () => {
        if (isLogin) {
            scrollToShowtime();
        } else {
            navigate('/login');
        }
    };

    const handleChooseSeat = (movieScreeningId) => {
        if (isLogin) {
            navigate(`/showtime/${movieScreeningId}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="Movie">
            <div id="content">
                <div id="movie-details-container">
                    <div id="img_container">
                        <img src={movie.image ? `data:image/jpeg;base64,${movie.image}` : movie.title}
                             alt="Movie Poster"/>
                        <RankContainer rank={movie.rank}/>
                    </div>
                    <div id="details_container">
                        <div id="title_container">
                            <h1>{movie.title}</h1>
                        </div>
                        <div id="category_container">
                            <h4>{movie.categoryname}</h4>
                        </div>
                        <div id="description">
                            <p>{movie.description}</p>
                        </div>
                        <div id="more-details">
                            <p><strong>Start Date:</strong> {new Date(movie.startdate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(movie.enddate).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> {movie.duration} minutes</p>
                            <p><strong>Director:</strong> {movie.director}</p>
                            <p><strong>Minimum Age:</strong> {movie.minage}</p>
                            <p><strong>Production:</strong> {movie.production}</p>
                            <p><strong>Original Language:</strong> {movie.originallanguage}</p>
                            <div id="buy-button">
                                <button onClick={handleBuyTicket}>Buy Ticket</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div id="showtime_container" ref={showtimeRef}>
                    <div id="movie_showtime">
                        <h1>BUY TICKET ON {movie.title}</h1>
                        <div className="date-navigation">
                            {[...Array(7)].map((_, index) => {
                                const date = addDays(initialDate, index);
                                return (
                                    <span
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        className={date.toDateString() === selectedDate.toDateString() ? 'selected-date' : ''}
                                    >
                                        {format(date, 'EEE')}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="selected-date">
                            <h2>{format(selectedDate, 'EEEE yyyy-MM-dd')}</h2>
                        </div>
                        {filteredShowTimes.length === 0 ? (
                            <p>No available showtime for this movie.</p>
                        ) : (
                            <ul className="showtime-list">
                                {filteredShowTimes.map((showtime) => (
                                    <li key={showtime.moviescreeningid} className="showtime-item">
                                        <div className="showtime-details">
                                            <div className="showtime-movie-title">
                                                <div className="showtime-datetime">
                                                    <h5>Date:</h5>
                                                    <span>{new Date(showtime.date).toLocaleDateString()}</span>
                                                    <h5>Start:</h5>
                                                    <span>{showtime.starttime}</span>
                                                </div>
                                                <div id="3d_container">
                                                    <h5>3D:</h5>
                                                    <span>{showtime.threedimensional ? "Yes" : "No"}</span>
                                                </div>
                                                <div id="language_container">
                                                    <h5>Language:</h5>
                                                    <span>{showtime.language}</span>
                                                </div>
                                                <div id="hall_container">
                                                    <h5>Movie Hall:</h5>
                                                    <span>{showtime.moviehall}</span>
                                                </div>
                                            </div>
                                            <div id="button_container">
                                                <button
                                                    onClick={() => handleChooseSeat(showtime.moviescreeningid)}>Choose
                                                    perfect seat
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Movie;
