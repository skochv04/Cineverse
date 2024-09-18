import React from "react";
import "./styles/ModalConfirmation.css";

const ModalConfirmation = ({message, onClose, onConfirm, confirmText, closeText}) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <div className="button-container">
                    <button onClick={onClose} className="primary-button">{closeText}</button>
                    <button onClick={onConfirm} className="simple-button">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmation;