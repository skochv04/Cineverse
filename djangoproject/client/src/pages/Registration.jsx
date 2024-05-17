import React, {useState} from 'react';
import {Link} from "react-router-dom";
import './styles/Registration.css';
import Header from "./Header.jsx";

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            console.log('Form is valid');
        }
    };

    return (
        <div className="Registration">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content">
                <div className="registration-form-container">
                    <h2 className="title">Register</h2>
                    <form className="form" onSubmit={handleSubmit}>
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


