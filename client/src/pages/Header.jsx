import React, {useContext, useState} from 'react';
import './styles/Header.css';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from "../contexts/AuthContext.jsx";

function Header({setLogoutModalOpen}) {
    const {state} = useContext(AuthContext);
    const isLogin = state.isLogin;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const handleLogoutClick = () => {
        setLogoutModalOpen(true);
    };

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
        <div className='header_container'>
            <div id="Header">
                <div id="navbar_container">
                    <div id="logo_container">
                        <div className="logo">
                            <Link to="/"><span>CineVerse</span></Link>
                        </div>
                    </div>
                    <div id="navbar">
                        <div id="navbar_items">
                            <div className="nav_item">
                                <Link to="/"><span>Home</span></Link>
                            </div>
                            <div className="nav_item">
                                <Link to="/movies"><span>Movies</span></Link>
                            </div>
                            <div className="nav_item">
                                <Link to="/about_us"><span>About us</span></Link>
                            </div>
                            <div id="nav_to_user" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <Link to="/profile"><img src="src/assets/user.png" alt="User Profile"/></Link>
                                {isLogin && isUserMenuOpen && (
                                    <div className="user-menu">
                                        <div className="user-menu-item">
                                            <button onClick={handleLogoutClick}>
                                                <img src="src/assets/logout.png" alt="User Profile Icon"/>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!isLogin && isUserMenuOpen && (
                                    <div className="user-menu">
                                        <div className="user-menu-item">
                                            <button onClick={handleLogin} className="user-menu-button">
                                                <img src="src/assets/login.png" alt="User Profile Icon"/>
                                                <span>Log in</span>
                                            </button>
                                        </div>

                                        <div className="user-menu-item">
                                            <button onClick={handleRegister} className="user-menu-button">
                                                <img src="src/assets/signup.png" alt="User Profile Icon"/>
                                                <span>Sign up</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {isLogin && (
                                <div id="nav_to_cart">
                                    <Link to="/tickets"><img src="src/assets/cart.png" alt="Cart"/></Link>
                                </div>)}
                        </div>
                    </div>
                    <div id="mobile_navbar">
                        <div className="mobile_nav_item">
                            <Link to="/"><span>Home</span></Link>
                        </div>
                        {/* <div className="mobile_nav_item">
                            <Link to="/about_us"><span>About us</span></Link>
                        </div> */}
                        {isLogin ? (
                            <div className="mobile_nav_item">
                                <button onClick={handleLogoutClick}><span>Logout</span></button>
                            </div>
                        ) : (
                            <div className="mobile_nav_item">
                                <Link to="/login"><span>Login</span></Link>
                            </div>
                        )}
                        <div className="mobile_nav_item">
                            <Link to="/movies"><span>Movies</span></Link>
                        </div>
                        <div className="mobile_nav_item">
                            <Link to="/profile"><img src="src/assets/user.png" alt="User"/></Link>
                        </div>
                        <div className="mobile_nav_item">
                            <Link to="/tickets"><img src="src/assets/cart.png" alt="Cart"/></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;