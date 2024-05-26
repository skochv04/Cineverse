import React, {useEffect, useState} from 'react';
import './styles/Movies.css';
import Header from "./Header.jsx";
import {Link} from "react-router-dom";

const sortOptions = ['Alphabetical', 'Release Date', 'Rating'];

function Movies() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);


    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error('Error fetching movies: ', error));
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching movie categories: ', error));
    }, []);

    const sortMovies = (movies) => {
        switch (sortOption) {
            case 'Alphabetical':
                return [...movies].sort((a, b) => a.title.localeCompare(b.title));
            case 'Release Date':
                return [...movies].sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
            case 'Rating':
                return [...movies].sort((a, b) => b.rank - a.rank);
            default:
                return movies;
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || movie.category_name === parseInt(selectedCategory))
    );

    const sortedAndFilteredMovies = sortMovies(filteredMovies);

    return (
        <div className="Movies">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content">
                <div className="filter-sort-container">
                    <div className="search">
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search movies..."
                        />
                    </div>
                    <div className="filter">
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Select genres</option>
                            {categories.map((category) => (
                                <option key={category.moviecategoryid} value={category.moviecategoryid}>
                                    {category.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sort">
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sort by</option>
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="movies-list">
                    {sortedAndFilteredMovies.map(movie => (
                        <div key={movie.id} className="movie-item">
                            <Link to={`/movie/${movie.title}`}>
                                <img src={`data:image/jpeg;base64,${movie.image}`} alt={movie.title} />
                                <div>{movie.title}</div>
                            </Link>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Movies;

