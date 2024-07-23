import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Tickets from "./pages/Tickets.jsx";
import Profile from "./pages/Profile.jsx";
import Error from "./pages/Error.jsx";
import Registration from "./pages/Registration.jsx";
import Movies from "./pages/Movies.jsx";
import Movie from "./pages/Movie.jsx";
import Showtime from "./pages/Showtime.jsx";
import Admin from "./pages/Admin.jsx";
import Header from "./pages/Header.jsx";
import Logout from "./pages/Logout.jsx";
import axios from "axios";

function App() {
    const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') === 'true');
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Newcomer');
    const [tickets, setTickets] = useState([]);
    const specific_userID = 6;
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    useEffect(() => {
        if (isLogin) {
            localStorage.setItem('isLogin', isLogin);
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('isLogin');
            localStorage.removeItem('username');
        }
    }, [isLogin, username]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (!isLogin) {
                    console.log('Tickets error: You are not logged in.');
                } else {
                    const ticketsResponse = await axios.get(`http://127.0.0.1:8000/user/${username}/tickets`);
                    setTickets(ticketsResponse.data);
                    console.log('Tickets fetched:', ticketsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, [isLogin]);

    const handleLogoutClick = () => {
        setLogoutModalOpen(true);
    };

    return (
        <Router>
            <main>
                <Header isLogin={isLogin} onLogout={handleLogoutClick} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsLogin={setIsLogin} setUsername={setUsername} />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/profile"
                        element={<Profile username={username} />} />
                    <Route path="/tickets"
                        element={<Tickets tickets={tickets} setTickets={setTickets} username={username} />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/movie/:title" element={<Movie />} />
                    <Route path="/showtime/:moviescreeningID" element={<Showtime username={username} />} />
                    <Route path="/*" element={<Error />} />
                </Routes>
                <Logout open={logoutModalOpen} setLogoutModalOpen={setLogoutModalOpen} isLogin={isLogin}
                    setIsLogin={setIsLogin} username={username} setUsername={setUsername} />
            </main>
        </Router>
    );
}

export default App;





