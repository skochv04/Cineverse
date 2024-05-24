import React, {useEffect, useState} from "react";
import Header from "./Header.jsx";
import {Link} from "react-router-dom";
import { useParams } from 'react-router-dom';
import "./styles/Movie.css"
import axios from "axios";

function Movie() {
    const { title } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/movie/${title}/`);
                setMovie(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [title]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching movie details: {error.message}</p>;

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
                            <Link to={"/showtime"}>Buy Ticket</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
