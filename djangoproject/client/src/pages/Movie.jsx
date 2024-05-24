import React, {useEffect, useRef, useState} from "react";
import Header from "./Header.jsx";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import "./styles/Movie.css";
import axios from "axios";

function Movie() {
    const { title } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableShowTime, setAvailableShowTime] = useState([]);
    const showtimeRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieResponse = await axios.get(`http://127.0.0.1:8000/api/movie/${title}`);
                setMovie(movieResponse.data);

                const showTimeResponse = await axios.get(`http://127.0.0.1:8000/api/showtime/${title}`);
                setAvailableShowTime(showTimeResponse.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [title]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching movie details: {error.message}</p>;

    const scrollToShowtime = () => {
        if (showtimeRef.current) {
            showtimeRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="Movie">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <div id="movie-details">
                    <div id="img_container">
                        <img src={movie.image ? `data:image/jpeg;base64,${movie.image}` : movie.title} alt="Movie Poster" />
                    </div>
                    <div id="details_container">
                        <div id="title_container">
                            <h1>{movie.title}</h1>
                        </div>
                        <div id="description">
                            <p>{movie.description}</p>
                        </div>
                        <div id="more-details">
                            <p><strong>Category ID:</strong> {movie.moviecategoryid}</p>
                            <p><strong>Start Date:</strong> {new Date(movie.startdate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(movie.enddate).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> {movie.duration} minutes</p>
                            <p><strong>Director:</strong> {movie.director}</p>
                            <p><strong>Minimum Age:</strong> {movie.minage}</p>
                            <p><strong>Production:</strong> {movie.production}</p>
                            <p><strong>Original Language:</strong> {movie.originallanguage}</p>
                            <p><strong>Rank:</strong> {movie.rank}</p>
                        </div>
                        <div id="buy-button">
                            <button onClick={scrollToShowtime}>Buy Ticket</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='showtime_container' ref={showtimeRef}>
                <h2>Available Showtime</h2>
                <ul className="showtime-list">
                    {availableShowTime.map((showtime) => (
                        <li key={showtime.moviescreeningid} className="showtime-item">
                            <Link to="/stage" className="showtime-link">
                                <div className="showtime-details">
                                    <div className="showtime-movie-title">
                                        <h5>Movie title:</h5>
                                        <span>{movie.title}</span>
                                        <h5>3D:</h5>
                                        <span>{showtime.threedimensional ? "Yes" : "No"}</span>
                                        <h5>Language:</h5>
                                        <span>{showtime.language}</span>
                                        <h5>Movie Hall:</h5>
                                        <span>{showtime.moviehall}</span>
                                    </div>
                                    <div className="showtime-datetime">
                                        <h5>Date:</h5>
                                        <span>{new Date(showtime.date).toLocaleDateString()}</span>
                                        <h5>Start:</h5>
                                        <span>{showtime.starttime}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Movie;

