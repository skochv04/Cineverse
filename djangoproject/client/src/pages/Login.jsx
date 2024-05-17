import React, {useState} from 'react';
import {Link} from "react-router-dom";
import './styles/Login.css';
import Header from "./Header.jsx";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

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
            // Handle login logic here, e.g., API call to authenticate the user
        }
    };

    return (
        <div className="Login">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content">
                <div className="login-form-container">
                    <h2 className="title">Login</h2>
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

                        <button type="submit" className="button">Log In</button>
                        <p className="message">
                            I'm new <Link to="/register" className="link">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

