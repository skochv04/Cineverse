import React, { useEffect } from 'react';
import './styles/ErrorMessage.css';

const ErrorMessage = ({ message, type, clearMessage }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessage();
        }, 10000);
        return () => clearTimeout(timer);
    }, [clearMessage]);

    return (
        <div className={`message ${type}`}>
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;