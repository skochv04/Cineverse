import React, { useState } from 'react';
import './styles/Movies.css';
import Header from "./Header.jsx";
import {Link} from "react-router-dom";

const categories = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family'];
const sortOptions = ['Alphabetical', 'Release Date', 'Rating'];

function Movies() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

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
                                <option key={category} value={category}>{category}</option>
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
                    <Link to="/movie">Avatar</Link>
                </div>
            </div>
        </div>
    );
}

export default Movies;

