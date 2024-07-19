import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Header from './Header';
import './styles/Registration.css';
import axios from 'axios';

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Registration() {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await client.post('/api/register/', {
                    email,
                    username,
                    password
                });
                navigate('/login')
            } catch (error) {
                setErrors({ server: 'Failed to register. Please try again.' });
            }
        }
    };

    return (
        <div className="Registration">
            <div id="content">
                <div className="registration-form-container">
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
