import React from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom'
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

import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


function App() {

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        client.get("/api/user")
            .then(function (res) {
                setCurrentUser(true);
            })
            .catch(function (error) {
                setCurrentUser(false);
            })
    }, [])

    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/user_profile" element={<UserProfile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/movie/:title" element={<Movie />} />
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
