import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './styles/Registration.css';
import Header from "./Header.jsx";
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Registration() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!fullName) {
            formIsValid = false;
            errors['fullName'] = 'Full name is required';
        }

        if (!email) {
            formIsValid = false;
            errors['email'] = 'Email is required';
        }

        if (!password) {
            formIsValid = false;
            errors['password'] = 'Password is required';
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        client.post(
            "/api/register/",
            {
                email: email,
                username: fullName,
                password: password
            }
        ).then(function (res) {
            client.post(
                "/api/login/",
                {
                    email: email,
                    password: password
                }
            ).then(function (res) {
                // handle successful login, e.g., update state or redirect
            }).catch(function (error) {
                // handle login error
                console.error("Login error", error);
            });
        }).catch(function (error) {
            // handle registration error
            console.error("Registration error", error);
        });
    }

    return (
        <div className="Registration">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <div className="registration-form-container">
                    <h2 className="title">Register</h2>
                    <form className="form" onSubmit={e => handleSubmit(e)}>
                        <input
                            type="text"
                            className={`input ${errors.fullName ? 'error-input' : ''}`}
                            placeholder={errors.fullName || "Full Name"}
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />

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

                        <button type="submit" className="button">Register</button>
                        <p className="message">
                            Already registered? <Link to="/login" className="link">Log In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;