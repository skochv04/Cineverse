import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
import Footer from "./pages/Footer.jsx";
import Logout from "./pages/Logout.jsx";
import AuthContextProvider from "./contexts/AuthContext.jsx";

function App() {
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    return (
        <AuthContextProvider>
            <Router>
                <main>
                    <Header setLogoutModalOpen={setLogoutModalOpen}/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/movies" element={<Movies/>}/>
                        <Route path="/about_us" element={<AboutUs/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/tickets" element={<Tickets/>}/>
                        <Route path="/admin" element={<Admin/>}/>
                        <Route path="/movie/:title" element={<Movie/>}/>
                        <Route path="/showtime/:moviescreeningID" element={<Showtime/>}/>
                        <Route path="/*" element={<Error/>}/>
                    </Routes>
                    <Logout open={logoutModalOpen} setLogoutModalOpen={setLogoutModalOpen}/>
                    <Footer/>
                </main>
            </Router>
        </AuthContextProvider>
    );
}

export default App;