import React from 'react';
import {BrowserRouter as Router, Routes, Link, Route} from 'react-router-dom'
import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Cart from "./pages/Cart.jsx";
import Error from "./pages/Error.jsx";
import Registration from "./pages/Registration.jsx";
import Movies from "./pages/Movies.jsx";
import Movie from "./pages/Movie.jsx";
import Stage from "./pages/Stage.jsx";
import Showtime from "./pages/Showtime.jsx";


function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/user_profile" element={<UserProfile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/movie" element={<Movie />} />
                    <Route path="/showtime" element={<Showtime />} />
                    <Route path="/stage" element={<Stage />} />
                    <Route path="/*" element={<Error />} />
                </Routes>
            </main>
            {/*<footer>*/}
            {/*    <Footer />*/}
            {/*</footer>*/}
        </Router>
    );
}
export default App;
