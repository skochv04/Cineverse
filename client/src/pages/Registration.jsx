import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Registration.css';
import axios from 'axios';

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Registration() {
    const [user, setUser] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!user.email) {
            formIsValid = false;
            errors['email'] = 'Email is obligatory';
        }

        if (!user.username) {
            formIsValid = false;
            errors['username'] = 'Username is obligatory';
        }

        if (!user.password) {
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
                    email: user.email,
                    username: user.username,
                    password: user.password
                });
                navigate('/login')
            } catch (error) {
                setErrors({ server: 'Failed to sign up. Please try again.' });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    return (
        <div className="Registration">
            <div id="content">
                <div className="registration-form-container">
                    <h2 className="title">Sign up</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        {errors.server && <div className="error-message">{errors.server}</div>}
                        <input
                            type="email"
                            name="email"
                            className={`input ${errors.email ? 'error-input' : ''}`}
                            placeholder="Email"
                            value={user.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                        <input
                            type="text"
                            name="username"
                            className={`input ${errors.username ? 'error-input' : ''}`}
                            placeholder="Username"
                            value={user.username}
                            onChange={handleChange}
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}

                        <input
                            type="password"
                            name="password"
                            className={`input ${errors.password ? 'error-input' : ''}`}
                            placeholder="Password"
                            value={user.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                        <button type="submit" className="button">Sign up</button>
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
