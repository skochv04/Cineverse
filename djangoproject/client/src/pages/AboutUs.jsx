import React from "react";
import Header from "./Header.jsx";
import "./styles/AboutUs.css";

function AboutUs() {
    return (
        <div className="AboutUs">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content-container">
                <div id="content">
                    <div className="about-section">
                        <p>Cinverse is dedicated to bringing the magic of cinema to life. Located in the heart of
                            Poland, Cinverse offers an unparalleled movie-going experience, blending state-of-the-art
                            technology with timeless storytelling. Our mission is to create a sanctuary for movie
                            lovers, where every screening is a journey into the world of imagination.</p>
                    </div>
                    <div className="mission-section">
                        <h2>Our Mission</h2>
                        <p>To provide a premium cinema experience that entertains, inspires, and connects people through
                            the power of film.</p>
                    </div>
                    <div className="vision-section">
                        <h2>Our Vision</h2>
                        <p>To be the leading destination for film enthusiasts, fostering a community that celebrates the
                            art of cinema.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
