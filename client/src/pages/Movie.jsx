import React from "react";
// import { useHistory } from "react-router-dom";
import Header from "./Header.jsx";
import avatar from '../assets/movies_img/avatar.jpg';
import {Link} from "react-router-dom";

function Movie() {
    // const history = useHistory();

    const handleBuyTicket = () => {
        // history.push('/showtime');
    };

    return (
        <div className="Movie">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content">
                <h1>Movie Title</h1>
                <img src={avatar} alt="Movie Poster" />
                <p>Duration: 120 minutes</p>
                <p>Director: John Doe</p>
                <Link to={"/stage"}> Buy Ticket </Link>
            </div>
        </div>
    );
}

export default Movie;

