import React, { useEffect } from 'react';
import './styles/ErrorMessage.css';

const ErrorMessage = ({ message, clearError }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            clearError();
        }, 10000);
        return () => clearTimeout(timer);
    }, [clearError]);

    return (
        <div className="error-message">
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;

