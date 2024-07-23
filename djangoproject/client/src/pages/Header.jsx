import React, { useState } from 'react';
import './styles/Header.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Header({ isLogin, onLogout }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsUserMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsUserMenuOpen(false);
    };

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        // !!!!! change
        <div className={isHome ? 'header_container' : 'header_container'}>
            <div id="Header">
                <div id="navbar_container">
                    <div id="logo_container">
                        <div className="logo">
                            <a className="logo" href="/"><span>CineVerse</span></a>
                        </div>
                    </div>
                    <div id="navbar">
                        <div id="navbar_items">
                            <div className="nav_item">
                                <a href="/"><span>Home</span></a>
                            </div>
                            <div className="nav_item">
                                <a href="/movies"><span>Movies</span></a>
                            </div>
                            <div className="nav_item">
                                <a href="/about_us"><span>About us</span></a>
                            </div>
                            <div id="nav_to_user"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                <a href="/profile">
                                    <img src="/src/assets/user.png" alt="User Profile" />
                                </a>
                                {isLogin && isUserMenuOpen && (
                                    <div className="user-menu">
                                        <div className="user-menu-item">
                                            <button onClick={onLogout}>
                                                <img src="/src/assets/logout.png" alt="User Profile Icon" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!isLogin && isUserMenuOpen && (
                                    <div className="user-menu">
                                        <div className="user-menu-item">
                                            <button onClick={handleLogin} className="user-menu-button">
                                                <img src="/src/assets/login.png" alt="User Profile Icon" />
                                                <span>Log in</span>
                                            </button>
                                        </div>

                                        <div className="user-menu-item">
                                            <button onClick={handleRegister} className="user-menu-button">
                                                <img src="/src/assets/signup.png" alt="User Profile Icon" />
                                                <span>Sign up</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {isLogin && (
                                <div id="nav_to_cart">
                                    <a href="/tickets"><img src="/src/assets/cart.png" alt="Cart" /></a>
                                </div>)}
                        </div>
                    </div>
                    <div id="mobile_navbar">
                        <div className="mobile_nav_item">
                            <a href="/"><span>Home</span></a>
                        </div>
                        {/* <div className="mobile_nav_item">
                            <a href="/about_us"><span>About us</span></a>
                        </div> */}
                        {isLogin ? (
                            <div className="mobile_nav_item">
                                <button onClick={onLogout}><span>Logout</span></button>
                            </div>
                        ) : (
                            <div className="mobile_nav_item">
                                <a href="/login"><span>Login</span></a>
                            </div>
                        )}
                        <div className="mobile_nav_item">
                            <a href="/movies"><span>Movies</span></a>
                        </div>
                        <div className="mobile_nav_item">
                            <a href="/profile"><img src="/src/assets/user.png" alt="User" /></a>
                        </div>
                        <div className="mobile_nav_item">
                            <a href="/tickets"><img src="/src/assets/cart.png" alt="Cart" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;