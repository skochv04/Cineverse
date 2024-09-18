import React, {useContext, useState} from 'react';
import './styles/Movies.css';
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext.jsx";

const sortOptions = ['Alphabetical', 'Release Date', 'Rating'];

function Movies() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const {state} = useContext(AuthContext);
    const movies = state.movies;
    const categories = state.categories || [];

    const sortMovies = (movies) => {
        switch (sortOption) {
            case 'Alphabetical':
                return [...movies].sort((a, b) => a.title.localeCompare(b.title));
            case 'Release Date':
                return [...movies].sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
            case 'Rating':
                return [...movies].sort((a, b) => b.rank - a.rank);
            default:
                return movies;
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || movie.moviecategoryid === parseInt(selectedCategory))
    );

    const sortedAndFilteredMovies = sortMovies(filteredMovies);

    return (
        <div className="Movies">
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
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setIsCategoryOpen(false);
                            }}
                            onClick={() => setIsCategoryOpen(prev => !prev)}
                        >
                            <option value="">Select genres</option>
                            {categories.map((category) => (
                                <option key={category.moviecategoryid} value={category.moviecategoryid}>
                                    {category.categoryname}
                                </option>
                            ))}
                        </select>
                        <span className={`icon ${isCategoryOpen ? 'open' : ''}`}>&#9662;</span>
                    </div>
                    <div className="sort">
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                setIsSortOpen(false);
                            }}
                            onClick={() => setIsSortOpen(prev => !prev)}
                        >
                            <option value="">Sort by</option>
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <span className={`icon ${isSortOpen ? 'open' : ''}`}>&#9662;</span>
                    </div>
                </div>
                <div className="movies-list">
                    {sortedAndFilteredMovies.map(movie => (
                        <div key={movie.id} className="movie-item">
                            <Link to={`/movie/${movie.title}`}>
                                <img src={`data:image/jpeg;base64,${movie.image}`} alt={movie.title}/>
                                <div>{movie.title}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Movies;
