import React from "react";
// import { useHistory } from "react-router-dom";

function Showtime() {
    // const history = useHistory();

    const handleSelectShowtime = () => {

    };

    return (
        <div className="Showtimes">
            <h2>Select a Showtime</h2>
            <ul>
                <li onClick={handleSelectShowtime}>12:00 PM</li>
                <li onClick={handleSelectShowtime}>03:00 PM</li>
                <li onClick={handleSelectShowtime}>06:00 PM</li>
                <li onClick={handleSelectShowtime}>09:00 PM</li>
            </ul>
        </div>
    );
}

export default Showtime;
