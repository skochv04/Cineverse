import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/Showtime.css";
import Header from "./Header.jsx";

function Showtime() {
    const [availableShowTimes, setAvailableShowTimes] = useState([]);

    useEffect(() => {
        const testShowTimes = [
            {
                id: 1,
                movie_title: "The Matrix",
                date: "2024-05-21",
                time: "15:00:00"
            }
        ];
        setAvailableShowTimes(testShowTimes);
    }, []);

    return (
        <div className="Showtime">
            <div id="header_container">
                <Header />
            </div>
            <div id='showtime_container'>
                <h1 className="showtime-title">Choose Your Perfect Showtime</h1>
                <ul className="showtime-list">
                    {availableShowTimes.map((showtime) => (
                        <li key={showtime.id} className="showtime-item">
                            <Link to="/stage" className="showtime-link">
                                <div className="showtime-details">
                                    <div className="showtime-movie-title">
                                        <h2>Movie title:</h2>
                                        <span>{showtime.movie_title}</span>
                                    </div>
                                    <div className="showtime-datetime">
                                        <h3>Date:</h3>
                                        <span>{showtime.date}</span>
                                        <h3>Time:</h3>
                                        <span>{showtime.time}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Showtime;


