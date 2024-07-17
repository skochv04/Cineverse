import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Error from "./pages/Error.jsx";
import Registration from "./pages/Registration.jsx";
import Movies from "./pages/Movies.jsx";
import Movie from "./pages/Movie.jsx";
import Showtime from "./pages/Showtime.jsx";
import Admin from "./pages/Admin.jsx";

import axios from 'axios';
import Header from "./pages/Header.jsx";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('Username');

    useEffect(() => {
        client.get("/api/user")
            .then(function (res) {
                setIsLogin(true);
                setUsername(res.data.name);
            })
            .catch(function (error) {
                setIsLogin(false);
            });
    }, []);

    const handleLogout = () => {
        client.post("/api/logout")
            .then(() => {
                setIsLogin(false);
            })
            .catch(error => {
                console.error("There was an error logging out:", error);
            });
    };

    return (
        <Router>
            <main>
                <div id="header_container">
                    <Header isLogin={isLogin} onLogout={handleLogout} />
                </div>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login setIsLogin={setIsLogin} setUsername={setUsername}/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/about_us" element={<AboutUs/>}/>
                    <Route path="/user_profile" element={<UserProfile isLogin={isLogin} username={username} setUsername={setUsername}/>} />
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/movie/:title" element={<Movie/>}/>
                    <Route path="/showtime/:moviescreeningID" element={<Showtime/>} />
                    <Route path="/*" element={<Error/>} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;

