import React, {useEffect, useState} from 'react';
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
import Header from "./pages/Header.jsx";
import Logout from "./pages/Logout.jsx";
import axios from "axios";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('Newcomer');
    const specific_userID = 6;
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsResponse = await axios.get(`http://127.0.0.1:8000/user/${specific_userID}/tickets`);
                if (isLogin) {
                    setTickets(ticketsResponse.data);
                    console.log('Tickets fetched:', ticketsResponse.data);
                } else {
                    console.log('Tickets error: You are not logged in.');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, [specific_userID, isLogin]);
    const handleLogoutClick = () => {
        setLogoutModalOpen(true);
    };

    return (
        <Router>
            <main>
                <div id="header_container">
                    <Header isLogin={isLogin} onLogout={handleLogoutClick} />
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsLogin={setIsLogin} setUsername={setUsername} />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/user_profile" element={<UserProfile tickets={tickets} isLogin={isLogin} username={username} />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/movie/:title" element={<Movie />} />
                    <Route path="/showtime/:moviescreeningID" element={<Showtime />} />
                    <Route path="/*" element={<Error />} />
                </Routes>
                <Logout open={logoutModalOpen} setIsLogin={setIsLogin} setUsername={setUsername} setLogoutModalOpen={setLogoutModalOpen} />
            </main>
        </Router>
    );
}

export default App;


