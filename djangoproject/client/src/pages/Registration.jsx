import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Registration({ setCurrentUser }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
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

        if (!username) {
            formIsValid = false;
            errors['username'] = 'Username is obligatory';
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
                "/api/register/",
                {
                    email: email,
                    username: username,
                    password: password
                }
            ).then(function (res) {
                if (res.data.success) {
                    setCurrentUser(true);
                    navigate(res.data.redirect_url);
                } else {
                    setErrors({ server: res.data.error || 'Failed to register' });
                }
            }).catch(function (error) {
                console.error("There was an error registering:", error);
                setErrors({ server: 'Failed to register. Please try again.' });
            });
        }
    }

    return (
        <div className="Register">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <div className="register-form-container">
                    <h2 className="title">Register</h2>
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
                            type="text"
                            className={`input ${errors.username ? 'error-input' : ''}`}
                            placeholder={errors.username || "Username"}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
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
                            Already have an account? <Link to="/login" className="link">Log in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;
