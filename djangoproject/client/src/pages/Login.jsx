import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Login({ setCurrentUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
                "/api/login/",
                {
                    email: email,
                    password: password
                }
            ).then(function (res) {
                if (res.data.success) {
                    setCurrentUser(true);
                    navigate(res.data.redirect_url);
                } else {
                    setErrors({ server: res.data.error || 'Failed to log in' });
                }
            }).catch(function (error) {
                console.error("There was an error logging in:", error);
                setErrors({ server: 'Failed to log in. Please try again.' });
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
                        {errors.server && <div className="error-message">{errors.server}</div>}
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
