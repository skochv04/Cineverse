import React from 'react';
import './styles/Header.css'; // Upewnij się, że ścieżka do pliku CSS jest prawidłowa

function Header() {
    return (
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
                            <a href="/about_us"><span>About us</span></a>
                        </div>
                        <div className="nav_item">
                            <a href="/login"><span>Login</span></a>
                        </div>
                        <div className="nav_item">
                            <a href="/movies"><span>Movies</span></a>
                        </div>
                        <div id="nav_to_login">
                            <a href="/user_profile"><img src="/src/assets/user.png" alt="User" /></a>
                        </div>
                        <div id="nav_to_cart">
                            <a href="/cart"><img src="/src/assets/cart.png" alt="Cart" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

