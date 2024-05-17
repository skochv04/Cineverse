// MoviesContainer.js
import React from 'react';
import Carousel from './Carousel';
import './styles/MoviesContainer.css'

import avatar from '../assets/movies_img/avatar.jpg';
import niepokalana from '../assets/movies_img/niepokalana.jpg';
import artur from '../assets/movies_img/artur.jpg';
import omen from '../assets/movies_img/omen.jpg';
import tarot from '../assets/movies_img/tarot.jpg';
import spider from '../assets/movies_img/spider.jpg';
import monkeys from '../assets/movies_img/monkeys.jpg';
import furiosa from '../assets/movies_img/furiosa.jpg';
import war from '../assets/movies_img/war.jpg';
import perfect_days from '../assets/movies_img/perfect_days.jpg';
import monster from '../assets/movies_img/monster.png';
import king from '../assets/movies_img/king.jpg';

const MoviesContainer = () => {
    const soonMoviesSlides = [
        {content: 'Soon Movie 1', imageUrl: niepokalana},
        {content: 'Soon Movie 2', imageUrl: tarot},
        {content: 'Soon Movie 3', imageUrl: artur},
        {content: 'Soon Movie 4', imageUrl: omen},
        {content: 'Soon Movie 5', imageUrl: spider},
        {content: 'Soon Movie 6', imageUrl: monkeys},
        {content: 'Soon Movie 7', imageUrl: furiosa},
        {content: 'Soon Movie 8', imageUrl: monster},
        {content: 'Soon Movie 9', imageUrl: king},
        {content: 'Soon Movie 10', imageUrl: perfect_days},
        {content: 'Soon Movie 11', imageUrl: war},
    ];

    const bestRateMoviesSlides = [
        {content: 'Best Rate Movie 1', imageUrl: avatar},
        {content: 'Best Rate Movie 2', imageUrl: niepokalana},
        {content: 'Best Rate Movie 3', imageUrl: tarot},
        {content: 'Best Rate Movie 4', imageUrl: omen},
        {content: 'Best Rate Movie 5', imageUrl: monkeys},
        {content: 'Best Rate Movie 6', imageUrl: furiosa},
        {content: 'Best Rate Movie 7', imageUrl: artur},
        {content: 'Best Rate Movie 8', imageUrl: war},
        {content: 'Best Rate Movie 9', imageUrl: perfect_days},
        {content: 'Best Rate Movie 10', imageUrl: monster},
        {content: 'Best Rate Movie 11', imageUrl: king},
    ];

    return (
        <div id="movies_container">
            <div id="soon_movies">
                <div className="slider_title">
                <h2 id="carousel_title">Soon Movies</h2>
                </div>
                <Carousel slides={soonMoviesSlides}/>
            </div>
            <div id="best_rate_movies">
                <div className="slider_title">
                    <h2 id="carousel_title">Best Rated Movies</h2>
                </div>
                <Carousel slides={bestRateMoviesSlides}/>
            </div>
        </div>
    );
};

export default MoviesContainer;
