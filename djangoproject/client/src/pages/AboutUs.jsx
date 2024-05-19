import React from "react";
import Header from "./Header.jsx";
import "./styles/AboutUs.css"

function AboutUs() {
    return (
        <div className="AboutUs">

            <div id="header_container">
                <Header />
            </div>

            {/* <ul>
                {all.map(movie => (
                    <li key={movie.movieid}>{movie.title}</li>
                ))}
            </ul> */}
            {/* <h2>UserProfile</h2> */}

        </div>
    );
}

export default AboutUs