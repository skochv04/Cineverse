import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import './styles/MoviesContainer.css';

const MoviesContainer = () => {
    const [nowPlayingMoviesSlides, setnowPlayingMoviesSlides] = useState([]);
    const [soonMoviesSlides, setSoonMoviesSlides] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/current-movies')
            .then(response => response.json())
            .then(data => {

                const soonMoviesSlides = data.map(movie => ({
                    content: movie.title,
                    imageUrl: `data:image/jpeg;base64,${movie.image}`
                }));
                setSoonMoviesSlides(soonMoviesSlides);
            });

        fetch('http://localhost:8000/upcoming-movies')
            .then(response => response.json())
            .then(data => {

                const nowPlayingMoviesSlides = data.map(movie => ({
                    content: movie.title,
                    imageUrl: `data:image/jpeg;base64,${movie.image}`
                }));
                setnowPlayingMoviesSlides(nowPlayingMoviesSlides);
            });
    }, []);

    return (
        <div id="movies_container">
            <div id="soon_movies">
                <div className="slider_title">
                    <h2 id="carousel_title">Now Playing</h2>
                </div>
                <Carousel slides={soonMoviesSlides} />
            </div>
            <div id="best_rate_movies">
                <div className="slider_title">
                    <h2 id="carousel_title">Coming Soon</h2>
                </div>
                <Carousel slides={nowPlayingMoviesSlides} />
            </div>
        </div>
    );
};

export default MoviesContainer;