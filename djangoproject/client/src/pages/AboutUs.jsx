import React from "react";
import Header from "./Header.jsx";
import "./styles/AboutUs.css";

function AboutUs() {
    return (
        <div className="AboutUs">
            <section className="content">
                <h2>About Us</h2>
                <p>
                    Welcome to Cineverse, your ultimate destination for a cinematic experience like no other.
                    At Cineverse, we believe in the power of movies to transport you to different worlds,
                    evoke emotions, and create unforgettable memories. Our state-of-the-art theaters are designed
                    to provide you with the highest quality audio and visual experience.
                </p>
                <p>
                    Our mission is to bring the magic of cinema to life, offering a diverse selection of films
                    from around the world, including the latest blockbusters, indie gems, and timeless classics.
                    Whether you're a casual moviegoer or a film enthusiast, Cineverse is the place to be.
                </p>
                <p>
                    Join us at Cineverse and embark on a journey through the captivating world of cinema.
                    We are dedicated to making every visit an extraordinary experience for you, your friends, and family.
                </p>
            </section>
        </div>
    );
}

export default AboutUs;
