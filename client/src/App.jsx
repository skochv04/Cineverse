import React from 'react';
import {BrowserRouter as Router, Routes, Link, Route} from 'react-router-dom'
import './App.css';
import Header from "./pages/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Footer from "./pages/Footer.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Cart from "./pages/Cart.jsx";
import Error from "./pages/Error.jsx";


function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user_profile" element={<UserProfile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about_us" element={<AboutUs />} />
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
