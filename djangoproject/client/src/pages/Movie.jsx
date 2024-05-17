import React from "react";
import Header from "./Header.jsx";
import avatar from '../assets/movies_img/avatar.jpg';
import {Link} from "react-router-dom";
import "./styles/Movie.css"

function Movie() {
    return (
        <div className="Movie">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content">
                <div id="movie-details">
                    <div id="img_container">
                        <img src={avatar} alt="Movie Poster"/>
                    </div>
                    <div id="details_container">
                        <div id="title_container">
                            <h1>Avatar</h1>
                        </div>
                        <div id="description">
                            <p>Description of the movie goes here...</p>
                        </div>
                        <div id="more-details">
                            <div id="category">Category</div>
                            <p>Movie premiere: 17.06.2024</p>
                            <p>Duration: 120 minutes</p>
                            <p>Director: John Doe</p>
                        </div>
                        <div id="buy-button">
                            <Link to={"/stage"}>Buy Ticket</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Movie;

