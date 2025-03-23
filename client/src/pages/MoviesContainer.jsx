import React, { useContext } from 'react';
import Carousel from './Carousel';
import './styles/MoviesContainer.css';
import { AuthContext } from "../contexts/AuthContext.jsx";

const MoviesContainer = () => {
    const { state } = useContext(AuthContext);
    const nowPlayingMoviesSlides = state.currentMovies;
    const soonMoviesSlides = state.upcomingMovies;

    return (
        <div id="movies_container">
            <div id="soon_movies">
                <div className="slider_title">
                    <h2 id="carousel_title">Now Playing</h2>
                </div>
                <Carousel slides={nowPlayingMoviesSlides} />
            </div>
            <div id="best_rate_movies">
                <div className="slider_title">
                    <h2 id="carousel_title">Coming Soon</h2>
                </div>
                <Carousel slides={soonMoviesSlides} />
            </div>
        </div>
    );
};

export default MoviesContainer;