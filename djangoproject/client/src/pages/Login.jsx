import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './styles/Login.css';
import Header from "./Header.jsx";
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Login({ setCurrentUser }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!email) {
            formIsValid = false;
            errors['email'] = 'Email is obligatory';
        }

        if (!password) {
            formIsValid = false;
            errors['password'] = 'Password is obligatory';
        }

        setErrors(errors);
        return formIsValid;
    };

    function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            client.post(
                "/api/login",
                {
                    email: email,
                    password: password
                }
            ).then(function (res) {
                setCurrentUser(true);
            });
        }
    }

    return (
        <div className="Login">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <div className="login-form-container">
                    <h2 className="title">Log in</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className={`input ${errors.email ? 'error-input' : ''}`}
                            placeholder={errors.email || "Email"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className={`input ${errors.password ? 'error-input' : ''}`}
                            placeholder={errors.password || "Password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button type="submit" className="button">Log in</button>
                        <p className="message">
                            I am new <Link to="/register" className="link">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;