import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "./styles/AboutUs.css";

function AboutUs() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/movies/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="AboutUs">
            <div id="header_container">
                <Header />
            </div>
            <div>
                <button onClick={fetchMovies}>Load Movies</button>
                {error && <p>Error: {error}</p>}
                <div>
                    {movies.length > 0 ? (
                        <ul>
                            {movies.map((movie) => (
                                <li key={movie.movieid}>
                                    <h2>{movie.title}</h2>
                                    <p>{movie.description}</p>
                                    <p>Directed by: {movie.director}</p>
                                    <p>Duration: {movie.duration} minutes</p>
                                    <p>Rank: {movie.rank}</p>
                                    <img src={movie.image} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No movies loaded</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AboutUs;