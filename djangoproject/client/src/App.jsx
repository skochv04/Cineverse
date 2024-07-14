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
import Showtime from "./pages/Showtime.jsx";
import Admin from "./pages/Admin.jsx";

import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


function App() {

    const [currentUser, setCurrentUser] = useState(false);
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

    const handleLogout = () => {
        client.post("/api/logout")
            .then(() => {
                setCurrentUser(false);
            })
            .catch(error => {
                console.error("There was an error logging out:", error);
            });
    };

    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" element={<Home currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                    <Route path="/register" element={<Registration setCurrentUser={setCurrentUser} />} />
                    <Route path="/movies" element={<Movies currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/about_us" element={<AboutUs currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/user_profile" element={<UserProfile currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/admin" element={<Admin currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/cart" element={<Cart currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/movie/:title" element={<Movie currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/showtime/:moviescreeningID" element={<Showtime currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/*" element={<Error currentUser={currentUser} onLogout={handleLogout} />} />
                </Routes>
            </main>
        </Router>
    );
}
export default App;
