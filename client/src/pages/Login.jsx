import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './styles/Login.css';
import {AuthContext} from "../contexts/AuthContext.jsx";

function Login() {
    const {dispatch} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempt, setLoginAttempt] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (loginAttempt) {
            setLoginAttempt(false);
        }
    }, [loginAttempt]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event).then(r => r);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const content = await response.json();
            if (response.ok) {
                setLoginAttempt(true);
                const response = await fetch('http://localhost:8000/api/user/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',

                });
                const content = await response.json();
                console.log(content);
                dispatch({type: 'LOGIN', payload: {username: content.username}});
                navigate('/');
            } else {
                console.error('Login error:', content);
            }
        }
    };

    return (
        <div className="Login">
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
                            onKeyDown={handleKeyPress}
                        />
                        <input
                            type="password"
                            className={`input ${errors.password ? 'error-input' : ''}`}
                            placeholder={errors.password || "Password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button type="submit" className="button">Log in</button>
                        <p className="message">
                            Do not have an account? <Link to="/register" className="link">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;



