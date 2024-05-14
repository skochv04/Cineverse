import React from 'react';
import './styles/MovieItem.css';

function MovieItem({ title, image, description }) {
    return (
        <div className="movie-item">
            <img src={image} alt={title} />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default MovieItem;
